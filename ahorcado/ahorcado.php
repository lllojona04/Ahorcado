<?php
header("Access-Control-Allow-Origin: *");

// Definir los diccionarios JSON con las claves y sus arrays de palabras
// Diccionario 1
$diccionario1 = [
    "facil" => ["gato", "sol", "luna", "mesa", "rojo", "flor", "pan", "agua", "nube", "pez"],
    "normal" => ["elefante", "camión", "pirámide", "cereza", "avión", "montaña", "bosque", "ciudad", "planeta", "río"],
    "dificil" => ["paralelepípedo", "inconmensurable", "anticonstitucional", "desoxirribonucleico", "otorrinolaringología", "transubstanciación", "idiosincrasia", "circunlocución", "metempsicosis", "hipérbaton"]
];

// Diccionario 2
$diccionario2 = [
    "facil" => ["perro", "cielo", "estrella", "silla", "azul", "libro", "casa", "pluma", "sola", "vino"],
    "normal" => ["jirafa", "tren", "castillo", "manzana", "barco", "globo", "puente", "isla", "volcán", "cueva"],
    "dificil" => ["contrarrevolucionario", "hipopotomonstrosesquipedaliofobia", "electroencefalograma", "pneumonoultramicroscopicosilicovolcanoconiosis", "floccinaucinihilipilificación", "antropomorfismo", "interdisciplinariedad", "ininteligible", "supercalifragilisticoespialidoso", "esternocleidomastoideo"]
];

// Diccionario 3
$diccionario3 = [
    "facil" => ["ratón", "verde", "papel", "coche", "sol", "mar", "piedra", "taza", "llave", "reloj"],
    "normal" => ["cocodrilo", "avellana", "glaciar", "desierto", "satélite", "travesía", "murciélago", "escalera", "ventana", "almohada"],
    "dificil" => ["inconstitucionalidad", "desoxirribonucleótido", "electromagnetismo", "antropocentrismo", "hiperestesia", "neuroplasticidad", "epistemología", "fenomenología", "heterocromía", "tautología"]
];

// Diccionario 4
$diccionario4 = [
    "facil" => ["lápiz", "pan", "ojo", "nariz", "mano", "pie", "camisa", "pelo", "fruta", "leche"],
    "normal" => ["tigre", "avena", "catedral", "carretera", "naranja", "tren", "globo", "arena", "bosque", "cielo"],
    "dificil" => ["infranqueable", "antropomórfico", "electrocardiograma", "hiperbatón", "metalingüístico", "circunferencia", "onomatopeya", "paradigma", "anacoluto", "prosopopeya"]
];

// Crear array con todos los diccionarios codificados en JSON
$jsonArray = [
    json_encode($diccionario1),
    json_encode($diccionario2),
    json_encode($diccionario3),
    json_encode($diccionario4)
];

// Generar un índice aleatorio entre 0 y 3
$randomIndex = rand(0, 3);

// Devolver el diccionario seleccionado
// header('Content-Type: application/json');
echo $jsonArray[$randomIndex];
?>
