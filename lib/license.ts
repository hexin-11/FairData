import { LicenseType } from './types'

export const LICENSE_LABELS: Record<LicenseType, string> = {
  commercial_training: 'Commercial Training',
  fine_tuning_only: 'Fine-Tuning Only',
  no_derivatives: 'No Derivatives',
}

export const LICENSE_DESCRIPTIONS: Record<LicenseType, string> = {
  commercial_training: 'May be used to train any commercial AI model.',
  fine_tuning_only: 'May only be used to fine-tune an existing base model, not train from scratch.',
  no_derivatives: 'May not publish, redistribute, or sublicense the dataset itself.',
}

export const LICENSE_COLORS: Record<LicenseType, string> = {
  commercial_training: 'bg-green-100 text-green-800',
  fine_tuning_only: 'bg-blue-100 text-blue-800',
  no_derivatives: 'bg-orange-100 text-orange-800',
}
