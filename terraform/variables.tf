variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "myproject-rg"
}

variable "location" {
  description = "Azure region to deploy resources in"
  type        = string
  default     = "francecentral"
}

variable "kubernetes_version" {
  description = "Version of Kubernetes to use in AKS"
  type        = string
  default     = "1.29.9"
}

variable "node_count" {
  description = "Number of nodes in the AKS cluster"
  type        = number
  default     = 1
}

variable "vm_size" {
  description = "VM size for the AKS nodes"
  type        = string
  default     = "Standard_DS2_v2"
}
