# Bootstrap Instructions

This document provides step-by-step instructions for setting up the infrastructure on a fresh K3s cluster.

## Prerequisites

- K3s cluster running
- kubectl configured to access the cluster

## Step 1: Install ArgoCD

```bash
# Create ArgoCD namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

## Step 2: Access ArgoCD

```bash
# Get the admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port forward to access locally
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

- Open browser to https://localhost:8080
- Username: `admin`
- Password: (from the command above)
- Accept the self-signed certificate

## Step 3: Configure ArgoCD to Manage Infrastructure

1. In the ArgoCD UI, click **"+ NEW APP"**
2. Configure the application:
   - **Application Name**: `timothyw-infrastructure`
   - **Project**: `default`
   - **Sync Policy**: `Manual`
   
   **Source:**
   - **Repository URL**: `https://github.com/your-username/timothyw.dev` (update with your repo)
   - **Revision**: `HEAD`
   - **Path**: `helm`
   
   **Destination:**
   - **Cluster URL**: `https://kubernetes.default.svc`
   - **Namespace**: `timothyw-system`

3. Click **CREATE**

## Step 4: Sync the Infrastructure Application

1. In ArgoCD UI, find your `timothyw-infrastructure` application
2. Click **SYNC**
3. ArgoCD will automatically install the required dependencies:
   - cert-manager (with CRDs)
   - MetalLB (with CRDs)
   - ArgoCD IngressRoute
   - Kubernetes Dashboard
   - ClusterIssuer for Let's Encrypt
4. Click **SYNCHRONIZE**

## Step 5: DNS Configuration

Point your DNS records to your cluster's external IP:
- `argocd.timothyw.dev` → `51.81.211.182`
- `k8s.timothyw.dev` → `51.81.211.182`

## Step 6: Verify Setup

After DNS propagation, you should be able to access:
- ArgoCD: https://argocd.timothyw.dev
- Kubernetes Dashboard: https://k8s.timothyw.dev

## Next Steps

Once ArgoCD is managing your infrastructure, you can:
1. Add more applications to ArgoCD
2. Set up automatic sync policies
3. Configure RBAC and SSO
4. Set up monitoring and alerts

## Notes

- The helm chart includes cert-manager and MetalLB as dependencies, so ArgoCD will install everything needed
- If sync fails initially, wait a moment for CRDs to be installed and try again
- Once external access is working, you can switch from port-forwarding to the web interface