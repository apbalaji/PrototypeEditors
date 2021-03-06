'use strict';
module.exports = {
    options: {
        paths: ['client']
    },
    dev: {
        options: {
            compress: false,
            sourceMap: false
        },
        files: {
            'dev/assets/style.css': [
                'sample/client/**/*.less',
                'dev/resources/norman-prototype-editors-client/sprite.less',

                'node_modules/norman-*/**/*.less',
                '!node_modules/norman-openui5/**/*.less',
                '!node_modules/norman-*/node_modules/**/*.less',

                'node_modules/norman-client-tp/node_modules/angular-sap-*/**/*.less',
                '!node_modules/norman-client-tp/node_modules/angular-sap-ui-elements/node_modules/**/*.less'
            ]
        }
    }
};
