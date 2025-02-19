export const visualizations = ['QR Code', 'Barcode'] as const
export type VisualizationType = (typeof visualizations)[number]

export const ascentsOrTrainingList = ['Ascents', 'Training'] as const
export type AscentsOrTrainingType = (typeof ascentsOrTrainingList)[number]
