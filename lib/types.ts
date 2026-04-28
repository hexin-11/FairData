export type LicenseType = 'commercial_training' | 'fine_tuning_only' | 'no_derivatives'

export interface Dataset {
  id: string
  creator_id: string
  title: string
  description: string
  license_type: LicenseType
  price_usd: number
  file_size: number
  sha256_hash: string | null
  status: 'pending' | 'active' | 'inactive'
  created_at: string
}

export interface Transaction {
  id: string
  dataset_id: string
  buyer_email: string
  buyer_company: string
  stripe_payment_id: string
  amount_usd: number
  status: 'pending' | 'completed' | 'disputed' | 'refunded'
  created_at: string
}

export interface Certificate {
  id: string
  transaction_id: string
  dataset_hash: string
  buyer_email: string
  license_type: LicenseType
  price_usd: number
  issued_at: string
  pdf_path: string
}
