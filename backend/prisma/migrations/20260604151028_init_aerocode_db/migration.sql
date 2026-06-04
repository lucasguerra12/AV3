-- CreateTable
CREATE TABLE `Funcionario` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `usuario` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `nivelPermissao` ENUM('ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR') NOT NULL,

    UNIQUE INDEX `Funcionario_usuario_key`(`usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aeronave` (
    `codigo` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `tipo` ENUM('COMERCIAL', 'MILITAR') NOT NULL,
    `capacidade` INTEGER NOT NULL,
    `alcance` INTEGER NOT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Peca` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` ENUM('NACIONAL', 'IMPORTADA') NOT NULL,
    `fornecedor` VARCHAR(191) NOT NULL,
    `status` ENUM('PRONTA', 'EM_TRANSPORTE', 'EM_PRODUCAO', 'MANUTENCAO') NOT NULL,
    `aeronaveId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Etapa` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDENTE', 'ANDAMENTO', 'CONCLUIDA', 'BLOQUEADA') NOT NULL,
    `prazo` DATETIME(3) NOT NULL,
    `aeronaveId` VARCHAR(191) NOT NULL,
    `etapaAnteriorId` VARCHAR(191) NULL,

    UNIQUE INDEX `Etapa_etapaAnteriorId_key`(`etapaAnteriorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teste` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` ENUM('ELETRICO', 'HIDRAULICO', 'AERODINAMICO') NOT NULL,
    `dataValidade` DATETIME(3) NOT NULL,
    `resultado` ENUM('APROVADO', 'REPROVADO') NULL,
    `aeronaveId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FuncionarioEtapa` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FuncionarioEtapa_AB_unique`(`A`, `B`),
    INDEX `_FuncionarioEtapa_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Peca` ADD CONSTRAINT `Peca_aeronaveId_fkey` FOREIGN KEY (`aeronaveId`) REFERENCES `Aeronave`(`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Etapa` ADD CONSTRAINT `Etapa_aeronaveId_fkey` FOREIGN KEY (`aeronaveId`) REFERENCES `Aeronave`(`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Etapa` ADD CONSTRAINT `Etapa_etapaAnteriorId_fkey` FOREIGN KEY (`etapaAnteriorId`) REFERENCES `Etapa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teste` ADD CONSTRAINT `Teste_aeronaveId_fkey` FOREIGN KEY (`aeronaveId`) REFERENCES `Aeronave`(`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FuncionarioEtapa` ADD CONSTRAINT `_FuncionarioEtapa_A_fkey` FOREIGN KEY (`A`) REFERENCES `Etapa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FuncionarioEtapa` ADD CONSTRAINT `_FuncionarioEtapa_B_fkey` FOREIGN KEY (`B`) REFERENCES `Funcionario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
