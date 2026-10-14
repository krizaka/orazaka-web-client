# Interface Contracts (generated)

> 🤖 **Generated from code** by `scripts/generate-docs.mjs` — do not hand-edit. Run `orazaka docs build` to refresh.

## `orazaka-core`

**Inbound ports**

- `AiClient`
- `CatalogModelService`
- `ChatSessionService`
- `JobService`
- `McpService`

**Outbound ports**

- `AudioGeneratorClient`
- `CapabilityProvider`
- `ChatGeneratorClient`
- `ChatMemoryStore`
- `ImageGeneratorClient`
- `InfrastructureStatusProvider`
- `KnowledgeService`
- `McpOrchestrator`
- `ModelCatalogProvider`
- `ModelEndpointResolver`
- `PipelineConfigProvider`
- `PlatformMcpServerProvider`
- `PlatformToolConfigProvider`
- `SemanticClassifierPort`
- `TestShaperPort`
- `ToolRegistry`
- `UserCredentialsProvider`
- `UserMcpServerProvider`
- `ValidationPipelineRepository`

## `krizaka-users-core`

**Inbound ports**

- `ApiKeyService`
- `IdentityReconciliationService`
- `IdentityService`
- `PasswordRecoveryService`
- `RateLimitProvider`
- `TokenService`
- `UserProfileProvider`

**Outbound ports**

- `ApiKeyRepositoryPort`
- `AuthorityRepositoryPort`
- `CryptographyPort`
- `OAuth2ProviderVerifier`
- `PasswordEventPublisher`
- `PasswordResetTokenRepositoryPort`
- `UserCredentialRepositoryPort`
- `UserEventPublisher`
- `UserInterceptionRepositoryPort`
- `UserProfileRepositoryPort`
- `UserRepositoryPort`
- `VerificationTokenRepositoryPort`

## `orazaka-persistence-app-api`

**Inbound ports**

- `CapabilityManager`
- `CatalogModelManager`
- `ChatMemoryPersistenceProvider`
- `ChatSessionPersistenceProvider`
- `JobPersistenceProvider`
- `OutboxStore`
- `PipelineConfigManager`
- `PlatformMcpServerPersistenceProvider`
- `PlatformToolConfigPersistenceProvider`
- `RuntimeConfigProvider`
- `SpeechVoiceManager`
- `UserMcpServerPersistenceProvider`
- `ValidationPipelineManager`

