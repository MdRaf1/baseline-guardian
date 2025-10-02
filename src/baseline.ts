import featuresData from 'web-features/data.json';

export type BaselineStatus = 'widely available' | 'newly available' | 'limited availability' | 'unknown';

type FeatureStatus = {
  baseline?: 'high' | 'low' | false;
};

type FeatureDefinition = {
  status?: FeatureStatus;
  compat_features?: string[];
};

const FEATURE_PREFIX = 'css.properties.';


type BaselineValue = FeatureStatus['baseline'];

const baselinePriority = (value: BaselineValue): number => {
  if (value === 'high') {
    return 3;
  }

  if (value === 'low') {
    return 2;
  }

  if (value === false) {
    return 1;
  }

  return 0;
};

function mapBaselineValue(value: FeatureStatus['baseline']): BaselineStatus {
  if (value === 'high') {
    return 'widely available';
  }

  if (value === 'low') {
    return 'newly available';
  }

  if (value === false) {
    return 'limited availability';
  }

  return 'unknown';
}

function extractPropertyNames(compatFeatures: string[] | undefined): string[] {
  if (!compatFeatures) {
    return [];
  }

  const properties = new Set<string>();

  for (const feature of compatFeatures) {
    if (!feature.startsWith(FEATURE_PREFIX)) {
      continue;
    }

    const property = feature.slice(FEATURE_PREFIX.length).split('.')[0];

    if (property) {
      properties.add(property);
    }
  }

  return Array.from(properties);
}

const featureEntries = featuresData.features as Record<string, FeatureDefinition>;

const propertyBaselineMap = new Map<string, BaselineValue>();

for (const feature of Object.values(featureEntries)) {
  const baselineValue = feature.status?.baseline;

  if (baselineValue === undefined) {
    continue;
  }

  for (const property of extractPropertyNames(feature.compat_features)) {
    const currentValue = propertyBaselineMap.get(property);

    if (baselinePriority(baselineValue) > baselinePriority(currentValue)) {
      propertyBaselineMap.set(property, baselineValue);
    }
  }
}

export function getBaselineStatus(property: string): BaselineStatus {
  const normalizedProperty = property.toLowerCase();
  const baselineValue = propertyBaselineMap.get(normalizedProperty);

  if (baselineValue === undefined) {
    return 'unknown';
  }

  return mapBaselineValue(baselineValue);
}
