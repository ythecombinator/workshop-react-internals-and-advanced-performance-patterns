/**
 * ts-morph codemod: Enforce named prop interfaces
 *
 * Finds React component functions with inline object type annotations
 * in their parameters and extracts them into named interfaces.
 *
 * Usage:
 *   npx tsx src/codemods/enforce-prop-interfaces.ts <file>
 *
 * Before:
 *   function StatusBadge({ label, variant }: { label: string; variant: 'good' | 'poor' }) {
 *
 * After:
 *   interface StatusBadgeProps {
 *     label: string;
 *     variant: 'good' | 'poor';
 *   }
 *
 *   function StatusBadge({ label, variant }: StatusBadgeProps) {
 */

import { Project, SyntaxKind } from 'ts-morph';

const filePath = process.argv[2];

if (!filePath) {
  console.error(
    'Usage: npx tsx src/codemods/enforce-prop-interfaces.ts <file>'
  );
  process.exit(1);
}

const project = new Project({ tsConfigFilePath: 'tsconfig.json' });
const sourceFile = project.addSourceFileAtPath(filePath);

let changed = false;

for (const func of sourceFile.getFunctions()) {
  const name = func.getName();
  if (!name) {
    continue;
  }

  const params = func.getParameters();
  if (params.length !== 1) {
    continue;
  }

  const param = params[0];

  // Only handle destructured parameters: ({ a, b }: { ... })
  if (!param.getNameNode().isKind(SyntaxKind.ObjectBindingPattern)) {
    continue;
  }

  const typeNode = param.getTypeNode();
  if (!typeNode || !typeNode.isKind(SyntaxKind.TypeLiteral)) {
    continue;
  }

  const interfaceName = `${name}Props`;

  // Skip if the interface already exists
  if (sourceFile.getInterface(interfaceName)) {
    continue;
  }

  // Extract the type literal text and build the interface
  const members = typeNode.getMembers().map((member) => member.getText());

  sourceFile.insertInterface(func.getChildIndex(), {
    name: interfaceName,
    properties: members.map((memberText) => {
      const [propName, ...rest] = memberText.replace(/;$/, '').split(':');
      return {
        name: propName.trim(),
        type: rest.join(':').trim(),
      };
    }),
  });

  // Replace the inline type with the interface name
  param.setType(interfaceName);

  changed = true;
  console.log(`  Extracted ${interfaceName} from ${name}()`);
}

if (changed) {
  sourceFile.saveSync();
  console.log(`\n  Done: ${filePath}`);
} else {
  console.log(`  No inline prop types found in ${filePath}`);
}
