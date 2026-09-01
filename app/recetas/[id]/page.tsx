"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ComentariosSection from "@/app/components/ComentariosSection";

interface RecipeDetail {
  titulo: string;
  categoria: string;
  tiempo: string;
  dificultad: string;
  porciones: string;
  descripcion: string;
  ingredientes: string[];
  pasos: string[];
  imagen?: string;
}

// Base de datos local unificada con imágenes para cada receta
const recetasDetalles: Record<string, RecipeDetail> = {
  "1": {
    titulo: "Encebollado de Pescado",
    categoria: "Costa / Sopa",
    tiempo: "45 min",
    dificultad: "Media",
    porciones: "4 personas",
    descripcion: "Tradicional caldo de pescado con yuca, cebolla curtida y cilantro.",
    imagen: "https://lacocinadegisele.com/wp-content/uploads/2021/01/encebollado.jpg",
    ingredientes: [
      "2 libras de albacora o atún fresco",
      "1 libra de yuca troceada",
      "4 cebollas rojas (en rodajas finas)",
      "Tomate, pimiento y ají para el caldo",
      "Culantro (cilantro) fresco picado",
      "Limón, sal, comino y pimienta al gusto"
    ],
    pasos: [
      "Hervir agua con cebolla, pimiento, tomate, ajo y comino para crear el caldo base.",
      "Cocinar el pescado en el caldo hasta que esté tierno, luego retirarlo y desmenuzarlo.",
      "En el mismo caldo, cocinar la yuca hasta que esté suave.",
      "Curtir la cebolla roja con jugo de limón y sal.",
      "Servir la yuca con el caldo caliente, trozos de pescado encima y abundante cebolla curtida con culantro."
    ]
  },
  "2": {
    titulo: "Hornado",
    categoria: "Sierra / Plato Fuerte",
    tiempo: "120 min",
    dificultad: "Avanzada",
    porciones: "6 personas",
    descripcion: "Cerdo hornado acompañado de mote, llapingachos, agrio y maduro frito.",
    imagen: "https://i.pinimg.com/originals/94/78/85/9478858c2b29f96df7f3315c5d8a3ea0.jpg",
    ingredientes: [
      "1 pierna de cerdo entera",
      "Chicha de jora o cerveza",
      "Ajos, comino, achiote, orégano y sal",
      "Mote cocido",
      "Papa, queso y ají para los acompañamientos"
    ],
    pasos: [
      "Licuar los ajos, la chicha, el achiote y las especias para crear un adobo espeso.",
      "Untar la pierna de cerdo con el adobo y dejar reposar por varias horas o toda la noche.",
      "Hornear a temperatura moderada por varias horas hasta que la carne esté suave y la piel crujiente.",
      "Servir caliente acompañado de mote, tortillas de papa, maduro y el tradicional agrio."
    ]
  },
  "3": {
    titulo: "Locro de Papa",
    categoria: "Sierra / Sopa",
    tiempo: "40 min",
    dificultad: "Fácil",
    porciones: "4 personas",
    descripcion: "Sopa espesa de papa con queso fresco, aguacate y ají.",
    imagen: "https://tse4.mm.bing.net/th/id/OIP.HJb9qs_god8u82XOriHw6QHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    ingredientes: [
      "2 libras de papa chilla o superchola pelada y picada",
      "1 cebolla blanca picada finamente",
      "Achiote y mantequilla",
      "1 taza de leche",
      "Queso fresco en cubos",
      "Aguacate para acompañar"
    ],
    pasos: [
      "Hacer un refrito con la mantequilla, el achiote y la cebolla blanca.",
      "Agregar las papas picadas y rehogarlas por unos minutos.",
      "Añadir agua o caldo hasta cubrir las papas y cocinar hasta que se deshagan parcialmente.",
      "Incorporar la leche y el queso fresco justo antes de servir.",
      "Acompañar con rodajas de aguacate y ají al gusto."
    ]
  },
  "4": {
    titulo: "Seco de Pollo",
    categoria: "Costa-Sierra / Plato Fuerte",
    tiempo: "50 min",
    dificultad: "Media",
    porciones: "4 personas",
    descripcion: "Guiso de pollo jugoso preparado con naranjilla, cerveza y especias.",
    imagen: "https://tse3.mm.bing.net/th/id/OIP.NSJQEgffv2MJwBoX0BKQkAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    ingredientes: [
      "1 pollo troceado",
      "Jugo de 4 naranjillas (lulo)",
      "1 taza de cerveza",
      "Cebolla, pimiento, tomate y ajo",
      "Culantro picado",
      "Arroz y maduro para servir"
    ],
    pasos: [
      "Preparar un refrito con la cebolla, tomate, pimiento y ajo.",
      "Sellar las piezas de pollo en el refrito.",
      "Agregar el jugo de naranjilla, la cerveza y cocinar a fuego lento.",
      "Incorporar culantro fresco picado al final de la cocción.",
      "Servir caliente acompañado de arroz blanco y maduros fritos."
    ]
  },
  "5": {
    titulo: "Fritada",
    categoria: "Sierra / Plato Fuerte",
    tiempo: "90 min",
    dificultad: "Media",
    porciones: "5 personas",
    descripcion: "Trocitos de carne de cerdo cocidos en agua y jugos propios, dorados en su propia grasa.",
    imagen: "https://4.bp.blogspot.com/-pOSJPY2PbLI/VZ3aHx_WVoI/AAAAAAAABds/FBtkAxEsocw/s1600/Fritada.jpg",
    ingredientes: [
      "3 libras de carne de cerdo en trozos",
      "2 tazas de agua o jugo de naranja agria",
      "Ajo, cebolla y comino",
      "Mote y tostado para acompañar"
    ],
    pasos: [
      "Colocar el cerdo en un sartén u olla grande con agua, ajo, cebolla y sal.",
      "Cocinar a fuego medio hasta que el agua se evapore por completo.",
      "Dejar que la carne se dore en su propia grasa hasta que quede crujiente.",
      "Servir acompañada de mote, tostado y plátano maduro."
    ]
  },
  "6": {
    titulo: "Guatita",
    categoria: "Costa-Sierra / Plato Fuerte",
    tiempo: "60 min",
    dificultad: "Avanzada",
    porciones: "6 personas",
    descripcion: "Tradicional plato a base de mondongo cocinado en una riquísima salsa de maní con papas.",
    imagen: "https://th.bing.com/th/id/R.2f4ae237171af85820916be7c84f1645?rik=EUQ03KPHn9VOpA&pid=ImgRaw&r=0",
    ingredientes: [
      "2 libras de mondongo (librillo) limpio",
      "Maní (cacahuate) licuado con leche",
      "Papas picadas en cubos",
      "Refrito de cebolla, pimiento, ajo y maní"
    ],
    pasos: [
      "Cocinar el mondongo en olla de presión hasta que esté suave y picarlo en trocitos.",
      "Preparar un refrito base y añadir la pasta de maní disuelta en leche.",
      "Agregar las papas y el mondongo cocinado, cocinando hasta que las papas estén listas.",
      "Servir caliente con arroz blanco."
    ]
  },
  "7": {
    titulo: "Ceviche de Camarón",
    categoria: "Costa / Entrada",
    tiempo: "30 min",
    dificultad: "Fácil",
    porciones: "4 personas",
    descripcion: "Camarones en jugo de limón, naranja, tomate, cebolla y culantro.",
    imagen: "https://vertelenovelas.net/wp-content/uploads/2024/06/ceviche-mixto-ecuatoriano-1024x680.jpg",
    ingredientes: [
      "2 libras de camarones cocidos",
      "Jugo de limón y naranja",
      "Cebolla roja en pluma",
      "Tomate licuado y culantro fresco",
      "Canguil y chifles para acompañar"
    ],
    pasos: [
      "Cocinar los camarones brevemente en agua con sal y reservar su agua.",
      "Mezclar el jugo de limón, naranja y la pasta de tomate con el agua de camarón.",
      "Incorporar los camarones, la cebolla curtida y el culantro fresco.",
      "Servir frío acompañado de chifles y canguil."
    ]
  },
  "8": {
    titulo: "Mote Pillo",
    categoria: "Sierra / Acompañante",
    tiempo: "25 min",
    dificultad: "Fácil",
    porciones: "4 personas",
    descripcion: "Mote tierno cocinado y salteado con un refrito de achiote, cebolla, ajo, leche y huevo batido.",
    imagen: "https://4.bp.blogspot.com/-Z_T38sMHuGw/TrxQd5qQQuI/AAAAAAAAAHk/r9iTi0eX1NI/s1600/mote-pillo.JPG",
    ingredientes: [
      "4 tazas de mote cocido",
      "Huevos batidos",
      "Cebolla blanca y achiote",
      "Un chorrito de leche"
    ],
    pasos: [
      "Hacer un refrito con achiote y cebolla blanca.",
      "Agregar el mote cocido y mezclar bien.",
      "Añadir la leche y verter los huevos batidos encima.",
      "Revolver suavemente hasta que el huevo se cocine y quede cremoso."
    ]
  },
  "9": {
    titulo: "Bolón de Verde",
    categoria: "Costa / Desayuno",
    tiempo: "20 min",
    dificultad: "Fácil",
    porciones: "3 personas",
    descripcion: "Masa de plátano verde machacado rellena de queso o chicharrón.",
    imagen: "https://th.bing.com/th/id/R.8438d810c19cf927198db3d6e712448e?rik=8qUfFr5wgN4Vhg&riu=http%3a%2f%2f2.bp.blogspot.com%2f-RZvAzGgJ0-w%2fVTUnyf5Wx-I%2fAAAAAAAAABs%2fFZ1qthAgNFQ%2fs1600%2fbolon%252Bde%252Bverde%252Bmixto.jpg&ehk=20clFcW2rYjdacd9bY0y4ca4iOangUWFOj49TcEgw0A%3d&risl=&pid=ImgRaw&r=0",
    ingredientes: [
      "4 plátanos verdes",
      "Queso fresco desmenuzado o chicharrón de cerdo",
      "Mantequilla o aceite",
      "Sal al gusto"
    ],
    pasos: [
      "Pelar y trocear los plátanos verdes, luego freírlos o cocinarlos hasta que estén suaves.",
      "Machacar los trozos de verde caliente en un mortero o recipiente.",
      "Formar porciones de masa, rellenar con queso o chicharrón y dar forma de bola.",
      "Servir caliente."
    ]
  },
  "10": {
    titulo: "Llapingacho",
    categoria: "Sierra / Plato Fuerte",
    tiempo: "40 min",
    dificultad: "Media",
    porciones: "4 personas",
    descripcion: "Tortillas de papa doradas rellenas de queso, con chorizo, huevo frito y salsa de maní.",
    imagen: "https://i.pinimg.com/originals/b1/88/90/b18890fbc6b1049141ed83a5f067153a.jpg",
    ingredientes: [
      "Papas cocidas y machacadas",
      "Queso fresco",
      "Achiote y cebolla",
      "Chorizos y huevos para acompañar"
    ],
    pasos: [
      "Preparar un puré espeso con las papas y el refrito de achiote con cebolla.",
      "Formar tortillas, rellenar con queso y dorarlas en una plancha con un poco de aceite.",
      "Servir con chorizo, huevo frito y salsa de maní."
    ]
  },
  "11": {
    titulo: "Chuleta Asada con Arroz y Menestra",
    categoria: "Costa / Plato Fuerte",
    tiempo: "35 min",
    dificultad: "Fácil",
    porciones: "4 personas",
    descripcion: "Jugosa chuleta de cerdo asada, servida con arroz blanco, menestra de lenteja o frejol.",
    imagen: "https://turismo.ecuadors.live/wp-content/uploads/2023/07/Arroz-con-menestra-y-carne.jpg",
    ingredientes: [
      "Chuletas de cerdo",
      "Lentejas o frejol tierno",
      "Arroz blanco y maduros",
      "Ajo, comino y limón"
    ],
    pasos: [
      "Marinar las chuletas con ajo, comino y sal.",
      "Asar las chuletas a la parrilla o sartén hasta que estén doradas.",
      "Preparar la menestra de lenteja o frejol bien cremosa.",
      "Servir con arroz, patacones y ensalada criolla."
    ]
  },
  "12": {
    titulo: "Cazuela de Pescado",
    categoria: "Costa / Plato Fuerte",
    tiempo: "50 min",
    dificultad: "Media",
    porciones: "4 personas",
    descripcion: "Concentrado de pescado con maní, verde y refrito servido en plato de barro.",
    imagen: "https://tse4.mm.bing.net/th/id/OIP.UUQ1daPSXRExKQihmPXtDAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    ingredientes: [
      "Pescado en trozos",
      "Masa de plátano verde rallado",
      "Maní licuado",
      "Refrito criollo"
    ],
    pasos: [
      "Mezclar la masa de verde con el maní licuado y el refrito.",
      "Colocar una porción en un plato de barro, agregar los trozos de pescado crudo en el centro.",
      "Hornear hasta que cocine la masa y el pescado."
    ]
  },
  "13": {
    titulo: "Bollo de Pescado",
    categoria: "Costa / Plato Fuerte",
    tiempo: "45 min",
    dificultad: "Media",
    porciones: "4 personas",
    descripcion: "Masa de plátano verde rallado sazonada con refrito y maní, rellena de pescado.",
    imagen: "https://tse4.mm.bing.net/th/id/OIP.s81OwxiH-b4u6EvY6GfrngHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    ingredientes: [
      "Verde rallado",
      "Pescado sazonado",
      "Maní y hojas de achira o plátano para envolver"
    ],
    pasos: [
      "Mezclar el verde rallado con el refrito y maní.",
      "Colocar la mezcla en hojas de plátano con el pescado en el centro.",
      "Cerrar el paquete y cocinar al vapor."
    ]
  },
  "14": {
    titulo: "Corviche",
    categoria: "Costa / Aperitivo",
    tiempo: "30 min",
    dificultad: "Media",
    porciones: "4 personas",
    descripcion: "Masa de verde rellena de pescado, frita y servida con ají y cebolla.",
    imagen: "https://tse1.mm.bing.net/th/id/OIP.mU07CHA8xT0Cmsa7dDldDAHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    ingredientes: [
      "Plátano verde cocido y rallado",
      "Maní, refrito y pescado desmenuzado"
    ],
    pasos: [
      "Hacer una masa con el verde y un poco de maní.",
      "Dar forma alargada, rellenar con el pescado y freír en aceite caliente."
    ]
  },
  "15": {
    titulo: "Sopa de Pollo",
    categoria: "Sopa",
    tiempo: "40 min",
    dificultad: "Fácil",
    porciones: "4 personas",
    descripcion: "Caldo tradicional de pollo con presa tierna, yuca, papa, zanahoria, fideos o arroz, y culantro fresco.",
    imagen: "https://recetacubana.com/wp-content/uploads/2018/02/receta-sopa-de-pollo.jpg",
    ingredientes: [
      "Presas de pollo",
      "Yuca, papa y zanahoria",
      "Fideos y culantro"
    ],
    pasos: [
      "Hervir el pollo con verduras y especias hasta obtener un caldo rico.",
      "Añadir yuca, papa y fideos.",
      "Servir caliente con culantro picado."
    ]
  },
  "16": {
    titulo: "Carne Apanada con Arroz y Puré",
    categoria: "Plato Fuerte",
    tiempo: "30 min",
    dificultad: "Fácil",
    porciones: "4 personas",
    descripcion: "Crujiente carne apanada acompañada de arroz blanco y un suave puré de papas cremoso.",
    imagen: "https://recetaskwa.com/wp-content/uploads/2024/02/Arroz_pure_1.jpg",
    ingredientes: [
      "Bistec de carne",
      "Huevo y pan rallado",
      "Papas para el puré"
    ],
    pasos: [
      "Pasar la carne por huevo batido y luego por pan rallado.",
      "Freír en aceite caliente hasta que esté dorada y crujiente.",
      "Servir con puré de papas y arroz."
    ]
  },
  "17": {
    titulo: "Seco de Chivo",
    categoria: "Plato Fuerte",
    tiempo: "90 min",
    dificultad: "Avanzada",
    porciones: "5 personas",
    descripcion: "Guiso tierno de chivo cocinado a fuego lento con chicha de jora y naranjilla.",
    imagen: "https://1.bp.blogspot.com/-fKDOqo_EsdE/X4chMexCADI/AAAAAAAAYNw/J6wEv7ICHJcz3H3a7bGlp95Tu4IN8XO9QCLcBGAsYHQ/s16000/gastronomia-tipica-de-ecuador-seco-de-chivo.jpg",
    ingredientes: [
      "Carne de chivo",
      "Naranjilla y chicha de jora",
      "Especias y culantro"
    ],
    pasos: [
      "Marinar el chivo con naranjilla y especias.",
      "Cocinar a fuego lento hasta que la carne esté muy suave y melosa.",
      "Servir con arroz y maduros."
    ]
  },
  "18": {
    titulo: "Pescado Frito con Patacones",
    categoria: "Costa / Plato Fuerte",
    tiempo: "35 min",
    dificultad: "Fácil",
    porciones: "4 personas",
    descripcion: "Tradicional pescado entero frito crujiente por fuera y jugoso por dentro.",
    imagen: "https://i.pinimg.com/originals/c5/8e/25/c58e259a1d1a03dc240abd3e6f5b10a6.jpg",
    ingredientes: [
      "Pescado entero (tilapia o corvina)",
      "Plátanos verdes para patacones",
      "Ajo, limón y sal"
    ],
    pasos: [
      "Sazonar el pescado con ajo y limón, luego freírlo en abundante aceite caliente.",
      "Hacer los patacones aplastando trozos de verde frito.",
      "Servir con arroz y curtido."
    ]
  },
  "19": {
    titulo: "Muchines de Yuca",
    categoria: "Costa / Aperitivo",
    tiempo: "30 min",
    dificultad: "Media",
    porciones: "4 personas",
    descripcion: "Deliciosos bollitos fritos elaborados a base de yuca rallada, rellenos de queso fresco o carne molida.",
    imagen: "https://recetasyuca.com/wp-content/uploads/2023/04/Muchines-de-Yuca-Receta.webp",
    ingredientes: [
      "Yuca cocida y rallada",
      "Queso o carne para el relleno",
      "Huevo"
    ],
    pasos: [
      "Rallar la yuca cocida, amasarla y formar bolitas con relleno.",
      "Freír hasta que estén doradas."
    ]
  },
  "20": {
    titulo: "Caldo de Bola de Verde",
    categoria: "Costa / Sopa",
    tiempo: "70 min",
    dificultad: "Avanzada",
    porciones: "5 personas",
    descripcion: "Sustancioso caldo con una gran bola de plátano verde rallado rellena de carne con pasas.",
    imagen: "https://gimmeyummy.com/wp-content/uploads/2020/07/easy-caldo-de-bolas-de-verde-e1606031818641.jpg",
    ingredientes: [
      "Costilla de res y verduras",
      "Masa de verde para la bola",
      "Carne picada, pasas y huevo para el relleno"
    ],
    pasos: [
      "Preparar un caldo concentrado de costilla de res.",
      "Hacer una bola grande de verde rellena de carne con pasas.",
      "Cocinar la bola dentro del caldo y servir con todos los vegetales."
    ]
  },
  "21": {
    titulo: "Pasta al limón cremosa",
    categoria: "Italia / Pasta",
    tiempo: "15 min",
    dificultad: "Fácil",
    porciones: "4 personas",
    descripcion: "Pasta rápida y sedosa con toque cítrico de limón y parmesano.",
    imagen: "https://sabordelobueno.com/wp-content/uploads/2023/05/pasta-al-limon-portada.jpg",
    ingredientes: ["Spaghetti", "Limón (ralladura y jugo)", "Queso parmesano", "Mantequilla"],
    pasos: ["Cocer la pasta en agua hirviendo con sal.", "Hacer salsa cremosa con mantequilla, jugo y ralladura de limón.", "Mezclar la pasta con la salsa y el parmesano."]
  },
  "22": {
    titulo: "Tacos de pollo",
    categoria: "México / Plato Fuerte",
    tiempo: "20 min",
    dificultad: "Fácil",
    porciones: "4 personas",
    descripcion: "Tacos mexicanos jugosos con pollo especiado y pico de gallo.",
    imagen: "https://assets.unileversolutions.com/recipes-v2/234572.jpg",
    ingredientes: ["Tortillas de maíz", "Pechuga de pollo", "Cebolla", "Cilantro", "Limón"],
    pasos: ["Saltear el pollo desmenuzado con especias.", "Calentar las tortillas de maíz en un sartén.", "Armar los tacos agregando cebolla, cilantro y limón."]
  },
  "23": {
    titulo: "Ají de gallina",
    categoria: "Perú / Plato Fuerte",
    tiempo: "30 min",
    dificultad: "Media",
    porciones: "4 personas",
    descripcion: "Crema peruana de ají amarillo, pollo desmenuzado y nueces.",
    imagen: "https://i.pinimg.com/originals/3e/8b/6d/3e8b6de0e204e025e4d5fcb8ecdfd9e5.jpg",
    ingredientes: ["Pechuga de pollo", "Ají amarillo", "Pan de molde", "Leche evaporada", "Nueces"],
    pasos: ["Licuar el ají amarillo con el pan remojado y leche evaporada.", "Mezclar la crema resultante con el pollo desmenuzado.", "Servir acompañado de papas cocidas y huevo duro."]
  },
  "24": {
    titulo: "Pollo teriyaki",
    categoria: "Japón / Plato Fuerte",
    tiempo: "20 min",
    dificultad: "Fácil",
    porciones: "4 personas",
    descripcion: "Pollo jugoso glaseado con salsa teriyaki dulce y salada.",
    imagen: "https://tse3.mm.bing.net/th/id/OIP.dGcE_ZBuUUC1QNlHuo3_hAHaE_?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    ingredientes: ["Pollo", "Salsa de soja", "Mirin", "Azúcar", "Jengibre"],
    pasos: ["Dorar los trozos de pollo en un sartén caliente.", "Añadir la mezcla de salsa de soja, mirin, azúcar y jengibre.", "Reducir a fuego lento hasta que espese y glasee el pollo."]
  },
  "25": {
    titulo: "Curry suave",
    categoria: "India / Plato Fuerte",
    tiempo: "25 min",
    dificultad: "Fácil",
    porciones: "4 personas",
    descripcion: "Curry aromático con leche de coco y verduras.",
    imagen: "https://recetasepicas.com/wp-content/uploads/2025/09/Pollo-al-curry-suave-2-683x1024.jpg",
    ingredientes: ["Pollo o verduras", "Pasta de curry", "Leche de coco", "Arroz basmati"],
    pasos: ["Sofritar la pasta de curry en una olla.", "Verter la leche de coco e integrar los ingredientes.", "Cocinar a fuego lento y servir acompañado de arroz basmati."]
  },
  "26": {
    titulo: "Quiche",
    categoria: "Francia / Plato Fuerte",
    tiempo: "45 min",
    dificultad: "Media",
    porciones: "4 personas",
    descripcion: "Tarta salada francesa con masa quebrada, huevos y queso.",
    imagen: "https://natashaskitchen.com/wp-content/uploads/2019/11/Classic-Quiche-Lorraine-Recipe-Beautiful-flaky-pastry-crust-is-paired-with-a-delicious-savory-egg-custard.-Perfect-for-breakfast-or-brunch.-1-4.jpg",
    ingredientes: ["Masa quebrada", "Huevos", "Crema de leche", "Queso gruyere", "Tocino"],
    pasos: ["Hornear la base de masa quebrada previamente.", "Batir los huevos con la crema de leche, el tocino y el queso.", "Verter la mezcla sobre la masa y hornear hasta que cuaje."]
  },
  "27": {
    titulo: "Empanadas clásicas",
    categoria: "Argentina / Aperitivo",
    tiempo: "40 min",
    dificultad: "Media",
    porciones: "4 personas",
    descripcion: "Empanadas argentinas de carne cortada a cuchillo.",
    imagen: "https://media.losandes.com.ar/p/7ab8e044e8850ac7f9494ab077b369fd/adjuntos/368/imagenes/100/064/0100064083/1200x675/smart/receta-facil-como-hacer-las-clasicas-empanadas-argentinas-carne-del-reconocido-chef-gaston-riveira-imagen-ilustrativa-web.jpg",
    ingredientes: ["Discos de empanada", "Carne picada", "Cebolla", "Comino", "Huevo duro"],
    pasos: ["Preparar y enfriar el guiso de carne con cebolla y condimentos.", "Rellenar los discos y hacer el repulgue tradicional.", "Hornear a alta temperatura o freír hasta dorar."]
  }
};

export default function DetalleRecetaPage() {
  const params = useParams();
  const id = params?.id as string;

  const [receta, setReceta] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReceta() {
      if (!id) return;

      // 1. Primero intentamos buscar si es una receta fija local
      if (recetasDetalles[id]) {
        setReceta(recetasDetalles[id]);
        setLoading(false);
        return;
      }

      // 2. Si no es local, la buscamos en Supabase invirtiendo las columnas para corregir el cruce
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (data && !error) {
          // CORRECCIÓN: Leemos "instrucciones" para los ingredientes y "ingredientes" para los pasos
          const rawIngredientes = data.instrucciones || data.ingredientes;
          const rawPasos = data.ingredientes || data.instrucciones;

          const ingredientesArray = rawIngredientes 
            ? (Array.isArray(rawIngredientes) 
                ? rawIngredientes 
                : rawIngredientes.split(/,|\n/).map((i: string) => i.trim()).filter(Boolean))
            : ["Ingredientes al gusto"];

          const pasosArray = rawPasos 
            ? (Array.isArray(rawPasos) 
                ? rawPasos 
                : rawPasos.split(/\. |\n/).map((p: string) => p.trim()).filter(Boolean))
            : ["Sigue las instrucciones generales de preparación."];

          setReceta({
            titulo: data.titulo,
            categoria: data.categoria || "Receta de la Comunidad",
            tiempo: data.tiempo || "30 min",
            dificultad: data.dificultad || "Fácil",
            porciones: data.porciones || "4 personas",
            descripcion: data.descripcion || "Deliciosa receta compartida por la comunidad.",
            imagen: data.imagen,
            ingredientes: ingredientesArray,
            pasos: pasosArray
          });
        }
      } catch (err) {
        console.error("Error buscando receta en Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReceta();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-36 pb-12 text-center">
        <p className="text-gray-500 text-lg animate-pulse">Cargando receta...</p>
      </div>
    );
  }

  if (!receta) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-36 pb-12 text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Receta no encontrada</h1>
        <p className="text-gray-500">Lo sentimos, la receta que buscas no existe o fue removida.</p>
        <Link href="/recetas" className="inline-block bg-orange-600 text-white font-medium px-6 py-2.5 rounded-xl shadow">
          Volver a Recetas
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-orange-100 p-6 sm:p-10 space-y-8">
        
        {receta.imagen && (
          <div className="w-full h-72 rounded-2xl overflow-hidden shadow-md">
            <img src={receta.imagen} alt={receta.titulo} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="space-y-3">
          <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            {receta.categoria}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {receta.titulo}
          </h1>
          <p className="text-gray-600 text-base">{receta.descripcion}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600 bg-orange-50/60 p-4 rounded-2xl border border-orange-100/60">
          <span>⏱️ Tiempo: {receta.tiempo}</span>
          <span>📊 Dificultad: {receta.dificultad}</span>
          <span>🍽️ Porciones: {receta.porciones}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
          
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-gray-900">Ingredientes</h3>
            <ul className="space-y-2.5">
              {receta.ingredientes.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-gray-700 text-sm">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-gray-900">Paso a Paso</h3>
            <ol className="space-y-3">
              {receta.pasos.map((paso, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm">
                  <span className="bg-orange-600 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5">{paso}</span>
                </li>
              ))}
            </ol>
          </div>

        </div>

        <div className="pt-6 border-t border-gray-100">
          <Link
            href="/recetas"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-2xl transition-colors shadow-md"
          >
            ← Volver al catálogo
          </Link>
        </div>

        <ComentariosSection recipeId={id} />

      </div>
    </div>
  );
}