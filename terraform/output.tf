output "cluster_id" {
  value = azurerm_kubernetes_cluster.myproject_aks.id
}

output "log_analytics_workspace_id" {
  value = azurerm_log_analytics_workspace.myproject_workspace.id
}
