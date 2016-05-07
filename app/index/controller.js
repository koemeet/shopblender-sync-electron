import Ember from 'ember';

const { computed, run } = Ember;

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    fileObject: Ember.inject.service(),

    isWatching: false,
    watcher: null,
    theme: null,

    themes: computed(function () {
        return this.get('store').query('theme', {
            include: 'templates',
            criteria: {
                workspace: this.get('session.user.customer.workspace.id')
            }
        });
    }),

    actions: {
        invalidateSession() {
            this.get('session').invalidate();
        },

        newTheme() {
            this.transitionToRoute('index.add-theme');
        },

        themeLabel(theme) {
            return theme.get('name');
        },

        watchTheme(theme) {
            const fs = require('fs');
            this.stopWatcher();

            if (!theme.get('localPath')) {
                theme.set('localPath', '/Users/steffen/Development/curesupport/new-theme');
            }

            fs.exists(theme.get('localPath') + '/theme.yml', (exists) => {
                if (exists) {
                    this.startWatcher(theme.get('localPath'));
                } else {
                    this.set('error', Ember.String.htmlSafe(`There is no <code>theme.yml</code> at that directory. Please provide a path to a valid theme.`));
                }
            });
        },

        stopWatching() {
            this.stopWatcher();
        }
    },

    startWatcher(path) {
        const sane = require('sane');

        try {
            this.set('watcher', new sane(path, {
                glob: ['templates/**/*.html.twig', 'theme.yml', 'public/**/*.+(css|js|png|jpg|jpeg|gif)']
            }));
        } catch (e) {
            console.log(e);
            this.set('error', Ember.String.htmlSafe(`<code>${e.code}</code>. Could not watch this directory, is it valid?`));
            return;
        }

        this.get('watcher').on('ready', run.bind(this, this.watcherReady));
        this.get('watcher').on('change', run.bind(this, this.fileChanged));
        this.get('watcher').on('add', run.bind(this, this.fileAdded));
        this.get('watcher').on('delete', run.bind(this, this.fileDeleted));
    },

    stopWatcher() {
        if (this.get('watcher')) {
            this.get('watcher').close();
            this.set('isWatching', false);
        }
    },

    watcherReady() {
        this.set('isWatching', true);
    },

    fileChanged(filepath, root, stat) {
        const fs = require('fs');
        const mime = require('mime-types');

        console.log('changed', filepath, root);

        let fullPath = root + '/' + filepath;
        let parts = filepath.split('/');
        let directory = parts.shift();
        let relativePath = parts.join('/');

        if ('theme.yml' === filepath) {
            fs.readFile(fullPath, 'utf8', (err, data) => {
                run(() => {
                    this.get('theme').set('schema', data);
                    this.get('theme').save().then(() => {
                        new Notification('Schema updated', {
                            title: 'Schema updated',
                            body: `Schema settings updated successfully!`
                        });
                    }).catch((e) => {
                        new Notification('Whoops', {
                            title: 'Whoops',
                            body: `Could not save schema settings, it may be incorrect.`
                        });
                    });
                });
            });
        }

        switch (directory) {
            case 'templates':
                let template = this.findOrCreateTemplate(relativePath);
                fs.readFile(fullPath, 'utf8', (err, data) => {
                    template.set('source', data);
                    template.save().then(() => {
                        new Notification('ee', {
                            title: 'Template updated',
                            body: `${relativePath} has been updated.`
                        });
                    });
                });
                break;
            case 'public':
                fs.readFile(fullPath, (err, data) => {
                    this.findOrCreateAsset(relativePath).then((asset) => {
                        if (data.length) {
                            asset.set('file', this.get('fileObject').fromBuffer(data, relativePath, mime.lookup(relativePath)));
                        }
                        asset.save();
                    });
                });
                break;
        }
    },

    fileAdded(filepath, root, stat) {
        const fs = require('fs');
        const mime = require('mime-types');

        console.log('added', filepath, root);

        let fullPath = root + '/' + filepath;
        let parts = filepath.split('/');
        let directory = parts.shift();
        let relativePath = parts.join('/');

        switch (directory) {
            case 'templates':
                let template = this.findOrCreateTemplate(relativePath);
                fs.readFile(fullPath, 'utf8', (err, data) => {
                    if (data) {
                        template.set('source', data);
                    }
                    template.save().then(() => {
                        new Notification('ee', {
                            title: 'Template added',
                            body: `${relativePath} has been updated.`
                        });
                    });
                });
                break;
            case 'public':
                fs.readFile(fullPath, (err, data) => {
                    this.findOrCreateAsset(relativePath).then((asset) => {
                        if (data.length) {
                            asset.set('file', this.get('fileObject').fromBuffer(data, relativePath, mime.lookup(relativePath)));
                        }

                        asset.save();
                    });
                });
                break;
        }
    },

    fileDeleted(filepath, root, stat) {
        const fs = require('fs');
        const mime = require('mime-types');

        console.log('delete', filepath, root);

        let fullPath = root + '/' + filepath;
        let parts = filepath.split('/');
        let directory = parts.shift();
        let relativePath = parts.join('/');

        switch (directory) {
            case 'templates':
                let template = this.findOrCreateTemplate(relativePath);
                template.destroyRecord();
                break;
            case 'public':
                this.findOrCreateAsset(relativePath).then((asset) => {
                    asset.destroyRecord().then(() => {
                        new Notification('Asset deleted', {
                            body: `${asset.get('name')} has been deleted.`
                        });
                    });
                });
                break;
        }
    },

    findOrCreateAsset(relativePath) {
        return new Ember.RSVP.Promise((resolve) => {
            this.get('store').query('media', {
                criteria: {
                    theme: this.get('theme.id'),
                    name: relativePath
                }
            }).then((assets) => {
                var asset = assets.get('firstObject');

                if (!asset) {
                    asset = this.get('store').createRecord('media', {
                        providerName: 'theme_asset',
                        name: relativePath,
                        theme: this.get('theme'),
                    });
                }

                resolve(asset);
            });
        });
    },

    findOrCreateTemplate(name) {
        let template = this.get('theme.templates').findBy('name', name);

        if (!template) {
            template = this.get('store').createRecord('template', {
                theme: this.get('theme'),
                name: name
            });
        }

        return template;
    }
});
