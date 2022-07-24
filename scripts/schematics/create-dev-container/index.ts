import { strings } from "@angular-devkit/core";
import { apply, applyTemplates, chain, mergeWith, move, Rule, SchematicContext, Tree, url } from "@angular-devkit/schematics";
import { Schema } from "./schema";

import { title, kebab } from 'case';

export default function (options: Schema): Rule {

    console.log('options', options);
    const [owner,repo] = options.githubRepo.split('/');
    
    console.log('owner:', owner);
    console.log('repo:', repo);
    
    let id = kebab(repo);
    console.log('id:', id);
    
    if (
        id.startsWith('devcontainer-') ||
        id.startsWith('devenv-') || 
        id.startsWith('devcont-')
    ) {
        const p = id.split('-');
        p.shift();
        id = p.join('-');
        console.log('id:', id);
    }

    id =  kebab(`${owner}-${id}`);
    console.log('id:', id);
    console.log('title:', title(id));

    return mergeWith(apply(url('./files'), [
        applyTemplates({
            utils: strings,
            ...options,
            id,
            title: title(id),
            'dot': '.'
        }),
        (host: Tree, context: SchematicContext) => {


        },
        move(options.directory),
    ]));
}