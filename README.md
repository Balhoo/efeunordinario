# efeuno

Mi primera página web: una experiencia responsiva sobre Fórmula 1 creada como proyecto universitario en 2023.

[Ver sitio](https://balhoo.github.io/efeunordinario/) · [Conocer al autor](https://github.com/Balhoo)

## Sobre el proyecto

efeuno documenta el inicio de mi trayectoria en desarrollo web. El sitio reúne contenido editorial, tarjetas de pilotos y productos, preguntas frecuentes, carruseles y navegación responsiva. En 2026 lo preparé para portafolio conservando su identidad original y corrigiendo problemas de accesibilidad, semántica y presentación.

El contenido deportivo y comercial representa una muestra histórica de 2023–2024. Este proyecto no está afiliado con Formula 1, la FIA, sus equipos ni las tiendas enlazadas, y no procesa registros, compras ni datos personales.

## Tecnologías

- HTML5 y CSS3
- JavaScript
- Bootstrap 5 y Bootstrap Icons
- Swiper
- AOS (Animate On Scroll)
- GitHub Pages

## Qué demuestra

- Estructura de una landing page de varias secciones
- Diseño responsivo para escritorio y dispositivos móviles
- Integración de componentes interactivos
- Organización de recursos estáticos
- Mejora progresiva de accesibilidad y HTML semántico

## Ejecutar localmente

No requiere compilación ni dependencias de ejecución. Con Node 24: `node server.mjs`, abrir http://127.0.0.1:3007. RaceLab usa módulos ES, por lo que requiere servir por HTTP; no abrir su HTML con file://. Pruebas: `node --test tests/*.test.mjs`.

## Actualización de octubre de 2026

Se añadió RaceLab en `racelab/`: copia identificada de la primera versión del simulador original, sin backend ni datos personales. Incluye comparación de estrategias, desgaste, paradas, gráfica/tabla, respaldos JSON y CSV. El enlace de regreso conserva la conexión con efeuno; la introducción coral pertenece a efeuno y la consola oscura a RaceLab. No es telemetría real ni contenido oficial de Formula 1.

Correcciones: controles móviles con botones, etiquetas y estado expandido; cierre con Escape; evitar selector inválido en enlaces `#`; volver al inicio mediante una acción de clic real; respeto a movimiento reducido. El archivo de noticias conserva su fecha histórica en vez de simular actualidad.

Al actualizar RaceLab, sincronizar exclusivamente sus archivos estáticos desde el repositorio principal privado y conservar el enlace de regreso. Nunca copiar almacenamiento del navegador, respaldos personales, dependencias de desarrollo ni servicios de backend. Esta integración no convierte la fuente principal de RaceLab en repositorio público.

## Estructura

```text
.
├── index.html
├── aboutme.html
└── assets/
    ├── images/
    ├── javascripts/
    ├── stylesheets/
    └── vendor/
```

## Autor

Alan Berra García — QA Engineer Jr y desarrollador de software.

- [GitHub](https://github.com/Balhoo)
- [LinkedIn](https://www.linkedin.com/in/alanberragarcia)

## Aviso sobre recursos

Las marcas, nombres, fotografías y artículos enlazados pertenecen a sus respectivos titulares. Se incluyen únicamente con fines educativos y de demostración. Las bibliotecas de terceros conservan sus licencias originales dentro de `assets/vendor`.
