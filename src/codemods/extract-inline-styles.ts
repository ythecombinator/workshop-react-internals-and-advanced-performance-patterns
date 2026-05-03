/**
 * Custom jscodeshift codemod: Extract inline style objects
 *
 * Finds JSX attributes named "style" whose value is an inline object
 * expression (e.g. `style={{ opacity: 1 }}`), hoists the object to a
 * `useMemo` call, and replaces the inline expression with the memoized
 * variable.
 *
 * Usage:
 *   npx jscodeshift -t src/codemods/extract-inline-styles.ts --extensions=tsx <file>
 *
 * Before:
 *   <Comp style={{ opacity: highlight ? 1 : 0.85 }} />
 *
 * After:
 *   const __style0 = useMemo(() => ({ opacity: highlight ? 1 : 0.85 }), [highlight]);
 *   ...
 *   <Comp style={__style0} />
 */

import type {
  API,
  ASTPath,
  FileInfo,
  Identifier,
  JSXAttribute,
} from 'jscodeshift';

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let styleCounter = 0;
  let needsUseMemo = false;

  root
    .find(j.JSXAttribute, { name: { name: 'style' } })
    .forEach((path: ASTPath<JSXAttribute>) => {
      const attr = path.node;

      if (
        attr.value?.type !== 'JSXExpressionContainer' ||
        attr.value.expression.type !== 'ObjectExpression'
      ) {
        return;
      }

      const styleExpression = attr.value.expression;
      const varName = `__style${styleCounter++}`;
      needsUseMemo = true;

      //  ---------------------------------------------------------------------------
      //  Collect free identifiers used inside the object for the dependency array.
      //  Skip property keys (e.g. `opacity` in `{ opacity: ... }`).
      //  ---------------------------------------------------------------------------

      const deps: string[] = [];
      j(styleExpression)
        .find(j.Identifier)
        .forEach((idPath: ASTPath<Identifier>) => {
          const parent = idPath.parent.node;
          const isPropertyKey =
            (parent.type === 'Property' || parent.type === 'ObjectProperty') &&
            idPath.node === parent.key;
          if (isPropertyKey) {
            return;
          }

          const name = idPath.node.name;
          if (!deps.includes(name)) {
            deps.push(name);
          }
        });

      //  ---------------------------------------------------------------------------
      //  Build: const __style0 = useMemo(() => ({ ... }), [deps]);
      //  ---------------------------------------------------------------------------

      const memoCall = j.callExpression(j.identifier('useMemo'), [
        j.arrowFunctionExpression(
          [],
          j.parenthesizedExpression(styleExpression)
        ),
        j.arrayExpression(deps.map((dep) => j.identifier(dep))),
      ]);

      const declaration = j.variableDeclaration('const', [
        j.variableDeclarator(j.identifier(varName), memoCall),
      ]);

      //  ---------------------------------------------------------------------------
      //  Insert the declaration before the return statement of the enclosing function.
      //  Walk up the scope chain to skip arrow functions with expression bodies
      //  (e.g. the callback inside .map()).
      //  ---------------------------------------------------------------------------

      let scope = path.scope;
      while (scope) {
        const body = scope.path.node?.body;
        if (body?.type === 'BlockStatement') {
          break;
        }
        scope = scope.parent;
      }

      if (!scope) {
        return;
      }

      const fnBody = scope.path.node.body;

      const returnIdx = fnBody.body.findIndex(
        (s: { type: string }) => s.type === 'ReturnStatement'
      );

      if (returnIdx === -1) {
        return;
      }

      fnBody.body.splice(returnIdx, 0, declaration);

      //  ---------------------------------------------------------------------------
      //  Replace inline object with variable reference
      //  ---------------------------------------------------------------------------

      attr.value = j.jsxExpressionContainer(j.identifier(varName));
    });

  //  ---------------------------------------------------------------------------
  //  Add useMemo import if needed
  //  ---------------------------------------------------------------------------

  if (!needsUseMemo) {
    return root.toSource({ quote: 'single' });
  }

  const reactImports = root.find(j.ImportDeclaration, {
    source: { value: 'react' },
  });

  if (reactImports.length > 0) {
    const importDecl = reactImports.at(0).get();
    const specifiers = importDecl.node.specifiers || [];

    const hasUseMemo = specifiers.some(
      (spec: { type: string; imported?: { name: string } }) =>
        spec.type === 'ImportSpecifier' && spec.imported?.name === 'useMemo'
    );

    if (!hasUseMemo) {
      specifiers.push(j.importSpecifier(j.identifier('useMemo')));
    }
  }

  return root.toSource({ quote: 'single' });
}
