import postcss from 'postcss';

export interface FoundProperty {
  property: string;
  line: number;
  file?: string;
}

function isDeclarationNode(node: unknown): node is postcss.Declaration {
  return Boolean(node) && typeof (node as postcss.Declaration).prop === 'string';
}

export function scanCss(cssContent: string): FoundProperty[] {
  const root = postcss.parse(cssContent);
  const properties: FoundProperty[] = [];

  root.walkDecls((decl: postcss.Declaration) => {
    if (!isDeclarationNode(decl)) {
      return;
    }

    const line = decl.source?.start?.line;

    if (typeof line !== 'number') {
      return;
    }

    properties.push({
      property: decl.prop.toLowerCase(),
      line
    });
  });

  return properties;
}
