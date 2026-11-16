/*
 * (c) Copyright Ascensio System SIA 2026
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { TStrings } from "../locales";

const pt: TStrings = {
  "contextMenu.label": "Obter código QR",
  "infoPanel.tabName": "Código QR",
  "modal.header": "Código QR do link partilhado",
  "hint.header": "O código QR abre o link partilhado",
  "hint.body":
    "Aponte a câmara de um telemóvel para o código para abrir este item. Quem pode abrir o link, os direitos de acesso, a validade e a senha são definidos no separador «{tab}».",
  "hint.emptyBody":
    "Este item ainda não tem um link partilhado. Crie-o no separador «{tab}», onde também escolhe quem o pode abrir, os direitos, a validade e a senha.",
  "hint.shareTab": "Partilhar",
  "hint.membersTab": "Contatos",
  "error.header": "Não foi possível carregar o link",
  "error.body":
    "O servidor não respondeu ou devolveu um erro. Normalmente é um problema de ligação momentâneo, por isso «Tente novamente» volta a pedir o link. Se o erro persistir, o link também está no separador «{tab}».",
  "modal.retry": "Tente novamente",
  "modal.unsupportedRoom":
    "Este tipo de sala não tem um link público ao nível da sala. Só uma sala pública, uma sala personalizada e um espaço de preenchimento de formulários o têm.",
  "modal.copy": "Copiar link",
  "modal.copied": "Link copiado para a área de transferência",
  "modal.copyFailed": "Não foi possível copiar o link",
  "modal.close": "Fechar",
  "link.create": "Criar link",
  "link.createFailed": "Não foi possível criar o link. Tente novamente mais tarde.",
  "link.anyone": "Qualquer pessoa com o link",
  "link.internal": "Somente usuários do espaço de trabalho",
  "link.password": "Protegido por senha",
  "link.noTimeLimit": "Este link não tem limite de tempo",
  "link.validUntil": "Este link é válido até {date}",
  "link.expired": "O link expirou",
  "access.read": "Apenas leitura",
  "access.edit": "Edição",
  "access.review": "Rever",
  "access.comment": "Comentário",
  "access.fillForms": "Preenchimento",
  "access.customFilter": "Filtro personalizado",
};

export default pt;
