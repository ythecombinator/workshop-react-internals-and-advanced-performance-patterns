/**
 * Custom jscodeshift codemod: Reduce inline arrow handlers
 *
 * Finds JSX expression containers with arrow functions that simply
 * delegate to another function with the same arguments (eta-reducible),
 * and replaces them with a direct reference to that function.
 *
 * Usage:
 *   npx jscodeshift -t src/codemods/extract-inline-handlers.ts --extensions=tsx <file>
 *
 * Before:
 *   <Comp onSelect={(id) => toggleProduct(id)} />
 *   <Comp onClick={() => handleClick()} />
 *
 * After:
 *   <Comp onSelect={toggleProduct} />
 *   <Comp onClick={handleClick} />
 *
 * Does NOT transform cases where:
 *   - The arrow has extra logic beyond a single call expression
 *   - The arguments don't match 1:1 (e.g. `(a, b) => fn(b, a)`)
 *   - The callee is a member expression (e.g. `(e) => e.preventDefault()`)
 */

import type {
  API,
  ASTPath,
  FileInfo,
  JSXExpressionContainer,
} from 'jscodeshift';

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root
    .find(j.JSXExpressionContainer)
    .forEach((path: ASTPath<JSXExpressionContainer>) => {
      const expr = path.node.expression;

      //  ---------------------------------------------------------------------------
      //  Match: (params) => fn(args) or () => fn()
      //  ---------------------------------------------------------------------------

      if (expr.type !== 'ArrowFunctionExpression') {
        return;
      }

      const { params, body } = expr;

      //  ---------------------------------------------------------------------------
      //  Body must be a single call expression (not a block)
      //  ---------------------------------------------------------------------------

      let callExpr;

      if (body.type === 'CallExpression') {
        callExpr = body;
      } else if (body.type === 'BlockStatement' && body.body.length === 1) {
        const stmt = body.body[0];
        if (
          stmt.type === 'ExpressionStatement' &&
          stmt.expression.type === 'CallExpression'
        ) {
          callExpr = stmt.expression;
        } else if (
          stmt.type === 'ReturnStatement' &&
          stmt.argument?.type === 'CallExpression'
        ) {
          callExpr = stmt.argument;
        }
      }

      if (!callExpr) {
        return;
      }

      //  ---------------------------------------------------------------------------
      //  Callee must be a simple identifier (not a.b())
      //  ---------------------------------------------------------------------------

      if (callExpr.callee.type !== 'Identifier') {
        return;
      }

      //  ---------------------------------------------------------------------------
      //  Arguments must match params exactly: same count, same order, same names
      //  ---------------------------------------------------------------------------

      const args = callExpr.arguments;
      if (args.length !== params.length) {
        return;
      }

      const argsMatch = params.every((param: any, index: number) => {
        const arg = args[index] as any;
        return (
          param.type === 'Identifier' &&
          arg.type === 'Identifier' &&
          param.name === arg.name
        );
      });

      if (!argsMatch) {
        return;
      }

      //  ---------------------------------------------------------------------------
      //  Replace the arrow with just the callee reference
      //  ---------------------------------------------------------------------------

      path.node.expression = callExpr.callee;
    });

  return root.toSource({ quote: 'single' });
}
