import { RiskModelContribution, RiskModelOutput, RuleAnalysis } from "../types/domain";

interface FeatureInput {
  name: string;
  value: number;
  weight: number;
}

function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

export function runRiskModel(ruleAnalysis: RuleAnalysis): RiskModelOutput {
  const features: FeatureInput[] = [
    {
      name: "Diagnosis disagreement",
      value: 1 - ruleAnalysis.metrics.diagnosisAlignment,
      weight: 2.3
    },
    {
      name: "Treatment disagreement",
      value: 1 - ruleAnalysis.metrics.treatmentAlignment,
      weight: 1.9
    },
    {
      name: "Medication disagreement",
      value: 1 - ruleAnalysis.metrics.medicationConsistency,
      weight: 1.7
    },
    {
      name: "Urgency disagreement",
      value: 1 - ruleAnalysis.metrics.urgencyAgreement,
      weight: 2.1
    },
    {
      name: "Diagnostic test disagreement",
      value: 1 - ruleAnalysis.metrics.testAlignment,
      weight: 1.1
    },
    {
      name: "Medication conflict count",
      value: Math.min(ruleAnalysis.medicationConflicts.length / 3, 1),
      weight: 0.9
    }
  ];

  const intercept = -1.8;
  const weightedSum =
    intercept + features.reduce((acc, feature) => acc + feature.value * feature.weight, 0);

  const probability = sigmoid(weightedSum);
  const modelScore = Math.round(probability * 100);

  const contributions: RiskModelContribution[] = features
    .map((feature) => ({
      feature: feature.name,
      impact: Number((feature.value * feature.weight).toFixed(3))
    }))
    .sort((left, right) => Math.abs(right.impact) - Math.abs(left.impact));

  const top = contributions[0];
  const summary =
    top && Math.abs(top.impact) > 0.25
      ? `Model sensitivity is currently most influenced by ${top.feature.toLowerCase()}.`
      : "Model drivers are distributed across multiple disagreement factors.";

  return {
    probability: Number(probability.toFixed(4)),
    modelScore,
    contributions,
    summary
  };
}
