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
  "file.typeName": "Mensagem de e-mail",
  "header.from": "De",
  "header.to": "Para",
  "header.cc": "Cc",
  "header.bcc": "Bcc",
  "header.date": "Data",
  "subject.empty": "(sem assunto)",
  "body.empty": "Esta mensagem não tem texto.",
  "body.title": "Corpo da mensagem",
  "attachments.title": "Anexos ({count})",
  "attachments.save": "Guardar nesta pasta",
  "attachments.saveAll": "Guardar todos",
  "images.blocked": "As imagens remotas estão bloqueadas para proteger a sua privacidade.",
  "images.load": "Carregar imagens",
  "images.hide": "Ocultar imagens",
  "toast.saved": "Ficheiro {name} guardado na pasta atual",
  "toast.savedAll": "Anexos guardados na pasta atual: {count}",
  "toast.saveFailed": "Não foi possível guardar {name}",
  "toast.saveFailedSome": "Não foi possível guardar anexos: {failed} de {total}",
  "state.loading": "A carregar a mensagem…",
  "state.empty": "Este ficheiro está vazio.",
  "state.loadFailed": "Não foi possível carregar o ficheiro.",
  "state.parseFailed":
    "Não foi possível ler esta mensagem. O ficheiro pode estar danificado ou não ser um e-mail.",
  "state.noFile": "Nenhum ficheiro selecionado.",
};

export default pt;
