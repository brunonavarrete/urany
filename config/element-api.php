<?php

use craft\elements\Entry;
use craft\helpers\UrlHelper;

return [
    'endpoints' => [
        'integradores.json' => function() {
            return [
                'elementType' => Entry::class,
                'criteria' => ['section' => 'integradores'],
                'transformer' => function(Entry $entry) {
                    return [
                        'title' => $entry->title,
                        'url' => $entry->url,
                        'jsonUrl' => UrlHelper::url("integradores/{$entry->id}.json"),
                    ];
                },
            ];
        },

        'api/locations.json' => function() {
            return [
                'elementType' => Entry::class,
                'criteria' => ['section' => 'integradores'],
                'transformer' => function(Entry $entry) {
                    $cats = "";
                    foreach ($entry->industria->all() as $cat) {
                        $cats .= $cat->slug."|";
                    }
                    return [
                        'id' => $entry->id,
                        'zipCode' => $entry->codigoPostal,
                        'cats' => $cats,
                    ];
                },
                'paginate' => false,
            ];
        },

        'api/integrador_info.json' => function() {
            return [
                'elementType' => Entry::class,
                'criteria' => ['section' => 'integradores'],
                'transformer' => function(Entry $entry) {
                    $images   = [];
                    $contacto = [];
                    $tags     = [];
                    $cats     = "";
                    foreach ($entry->industria->all() as $cat) {
                        $cats .= $cat->slug."|";
                    }
                    foreach ($entry->fotoEncabezado as $image) {
                        $images[] = $image->url;
                    }
                    foreach ($entry->contacto as $block) {
                        $bodyBlocks[] = [
                            'type' => $block->tipo->value,
                            'data' => $block->contacto,
                        ];
                    }
                    foreach ($entry->etiquetas as $etiqueta) {
                        $tags[] = $etiqueta->title;
                    }
                    return [
                        'id'       => $entry->id,
                        'zipCode'  => $entry->codigoPostal,
                        'cats'     => $cats,
                        'title'    => $entry->title,
                        'logo'     => reset($images),
                        'address'  => $entry->direccion,
                        'contacto' => $bodyBlocks,
                        'body'     => $entry->body,
                        'tags'     => $tags,
                    ];
                },
                'paginate' => false,
            ];
        },
        

    ]
];