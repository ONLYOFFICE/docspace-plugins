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
  "contextMenu.label": "Obtener código QR",
  "infoPanel.tabName": "Código QR",
  "modal.header": "Código QR del enlace compartido",
  "hint.header": "El código QR abre el enlace compartido",
  "hint.body":
    "Apunte la cámara del teléfono al código para abrir este elemento. Quién puede abrir el enlace, sus derechos de acceso, la caducidad y la contraseña se configuran en la pestaña «{tab}».",
  "hint.emptyBody":
    "Este elemento aún no tiene un enlace compartido. Créelo en la pestaña «{tab}», donde también puede elegir quién puede abrirlo, sus derechos, la caducidad y la contraseña.",
  "hint.shareTab": "Compartir",
  "hint.membersTab": "Contactos",
  "error.header": "No se pudo cargar el enlace",
  "error.body":
    "El servidor no respondió o devolvió un error. Suele ser un problema de conexión pasajero, así que «Inténtelo de nuevo» vuelve a solicitar el enlace. Si el error persiste, el enlace también está en la pestaña «{tab}».",
  "modal.retry": "Inténtelo de nuevo",
  "modal.unsupportedRoom":
    "Este tipo de sala no tiene un enlace público a nivel de sala. Solo lo tienen una sala pública, una sala personalizada y un espacio de relleno de formularios.",
  "modal.copy": "Copiar enlace",
  "modal.copied": "Enlace copiado en el portapapeles",
  "modal.copyFailed": "No se pudo copiar el enlace",
  "modal.close": "Cerrar",
  "link.create": "Crear enlace",
  "link.createFailed": "No se pudo crear el enlace. Inténtelo de nuevo más tarde.",
  "link.anyone": "Cualquiera con el enlace",
  "link.internal": "Solo usuarios del espacio de trabajo",
  "link.password": "Protegido con contraseña",
  "link.noTimeLimit": "Este enlace no tiene límite de tiempo",
  "link.validUntil": "Este enlace es válido hasta {date}",
  "link.expired": "El enlace ha caducado",
  "access.read": "Sólo lectura",
  "access.edit": "Edición",
  "access.review": "Revisión",
  "access.comment": "Comentario",
  "access.fillForms": "Rellenar",
  "access.customFilter": "Filtro personalizado",
};

export default es;
