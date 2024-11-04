terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">=3.50.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">=2.11.0"
    }
    null = {
      source  = "hashicorp/null"
      version = ">=3.0.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = "9b98830d-2a8d-4673-969e-b9fbbd723376"
  use_cli         = true
}

provider "kubernetes" {
  host                   = azurerm_kubernetes_cluster.myproject_aks.kube_config[0].host
  client_certificate     = base64decode(azurerm_kubernetes_cluster.myproject_aks.kube_config[0].client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.myproject_aks.kube_config[0].client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.myproject_aks.kube_config[0].cluster_ca_certificate)
}

# Resource Group
resource "azurerm_resource_group" "myproject_rg" {
  name     = "myproject-rg"
  location = "francecentral"
}

# Log Analytics Workspace for Monitoring
resource "azurerm_log_analytics_workspace" "myproject_workspace" {
  name                = "myproject-workspace"
  location            = azurerm_resource_group.myproject_rg.location
  resource_group_name = azurerm_resource_group.myproject_rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# AKS Cluster
resource "azurerm_kubernetes_cluster" "myproject_aks" {
  name                = "my-aks-cluster"
  location            = azurerm_resource_group.myproject_rg.location
  resource_group_name = azurerm_resource_group.myproject_rg.name
  dns_prefix          = "my-aks-cluster-dns"
  kubernetes_version  = "1.29.9"

  default_node_pool {
    name            = "nodepool"
    node_count      = 1
    vm_size         = "Standard_DS2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  # Networking configuration
  network_profile {
    network_plugin        = "azure"
    network_plugin_mode   = "overlay"
    load_balancer_sku     = "standard"
    service_cidr          = "10.20.0.0/16"
    dns_service_ip        = "10.20.0.10"
    pod_cidr              = "10.244.0.0/16"
    outbound_type         = "loadBalancer"
  }

  tags = {
    Environment = "Development"
  }
}

# Null Resource to Apply Kubernetes Manifests
resource "null_resource" "apply_k8s_manifests" {
  depends_on = [azurerm_kubernetes_cluster.myproject_aks]

  provisioner "local-exec" {
    command = <<EOT
      kubectl apply -f ../k8s-manifests/mysqldb-deployment.yaml
      kubectl apply -f ../k8s-manifests/mysqldb-service.yaml
      kubectl apply -f ../k8s-manifests/backend-deployment.yaml
      kubectl apply -f ../k8s-manifests/backend-service.yaml
      kubectl apply -f ../k8s-manifests/frontend-deployment.yaml
      kubectl apply -f ../k8s-manifests/frontend-service.yaml
    EOT
  }

  # Optional retry in case kubectl is not immediately available
  provisioner "local-exec" {
    command     = "sleep 10 && kubectl get pods --all-namespaces"
    interpreter = ["bash", "-c"]
  }
}
