import { strings } from "@angular-devkit/core";
import { apply, applyTemplates, chain, mergeWith, move, Rule, SchematicContext, Tree, url } from "@angular-devkit/schematics";
import { Schema } from "./schema";

import { title, kebab } from 'case';

export default function (options: Schema): Rule {
    return mergeWith(apply(url('./files'), [
        applyTemplates({
            utils: strings,
            ...options,
            title: title(options.name),
            id: kebab(options.name),
            'dot': '.'
        }),
        (host: Tree, context: SchematicContext) => {
        
            
        },
        move(options.directory),

    ]));
}