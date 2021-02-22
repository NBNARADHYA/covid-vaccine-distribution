#!/bin/bash
set -e

SERVICE_NAME=$1

echo "$KUBERNETES_CLUSTER_CERTIFICATE" >ca.crt

helm upgrade $SERVICE_NAME ./k8s/helm \
    --install \
    --kube-apiserver "$KUBERNETES_SERVER" \
    --kube-ca-file ca.crt \
    --kube-token "$KUBERNETES_TOKEN" \
    --kubeconfig /dev/null \
    -f ./services/$SERVICE_NAME/helm-values.yaml
