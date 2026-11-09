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

const es: TStrings = {
  "file.typeName": "Mensaje de correo electrónico",
  "header.from": "De",
  "header.to": "Para",
  "header.cc": "CC",
  "header.bcc": "CCO",
  "header.date": "Fecha",
  "subject.empty": "(sin asunto)",
  "body.empty": "Este mensaje no tiene texto.",
  "body.title": "Cuerpo del mensaje",
  "attachments.title": "Archivos adjuntos ({count})",
  "attachments.save": "Guardar en esta carpeta",
  "attachments.saveAll": "Guardar todos",
  "images.blocked": "Las imágenes remotas están bloqueadas para proteger su privacidad.",
  "images.load": "Cargar imágenes",
  "images.hide": "Ocultar imágenes",
  "toast.saved": "{name} se ha guardado en la carpeta actual",
  "toast.savedAll": "Archivos adjuntos guardados en la carpeta actual: {count}",
  "toast.saveFailed": "No se ha podido guardar {name}",
  "toast.saveFailedSome": "Archivos adjuntos no guardados: {failed} de {total}",
  "state.loading": "Cargando mensaje…",
  "state.empty": "Este archivo está vacío.",
  "state.loadFailed": "No se ha podido cargar el archivo.",
  "state.parseFailed":
    "No se ha podido leer este mensaje. Es posible que el archivo esté dañado o que no sea un correo electrónico.",
  "state.noFile": "No se ha seleccionado ningún archivo.",
};

export default es;
