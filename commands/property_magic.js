const FPlaybook = require('../model/fplaybook');
const CPlaybook = require('../model/cplaybook');


class PropertyMagic {

    static getProperties(schemaName) {
        let ret = {};
        let paths = Object.values(schemaName.schema.paths);
        for (var i = 0; i < paths.length; i++) {
            let path = paths[i];
            let pname = path.path;
            if (pname && ! ( pname.startsWith("_") || pname.endsWith("$")) ) {
                ret[path.path] = {
                    'name': pname,
                    'isa': path.instance, //'String', 'Number', or 'Array'
                    'default': path.defaultValue
                }
            }
        }
        return ret;

    }

    static FamilyProperties() {
        return PropertyMagic.getProperties(FPlaybook);

    }

    static CharacterProperties() {
        return PropertyMagic.getProperties(CPlaybook);
    }

    static PropertyActions() {
        return {
            SET: 'set',
            GET: 'get',
            ADD: 'add',
            REMOVE: 'remove'
        };
    }
    ;

    constructor(properties) {
        this.fmap = PropertyMagic.actionMap(properties);
    }

    static makeNumberFunction(prop) {
        let pa = PropertyMagic.PropertyActions();
        let SET = pa.SET;
        let GET = pa.GET;
        let ADD = pa.ADD;
        let REMOVE = pa.REMOVE;

        return {
            [SET]: async function (object, value) {
                object.set(prop.name, value);
                return `set ${prop.name} to ${value}`;
            },
            [GET]: async function (object) {
                return `${prop.name} is ${object.get(prop.name)}`;
            },
            [ADD]: async function (object, value) {
                let curr =  object.get(prop.name);
                object.set(prop.name, curr + parseInt(value, 10));
                return `added, ${prop.name} is now ${object.get(prop.name)}`;
            },
            [REMOVE]: async function (object) {
                object.set(prop.name, prop.default);
                return `deleted ${prop.name}`;
            }
        }
    }


    static makeArrayFunction(prop) {
        let pa = PropertyMagic.PropertyActions();
        let GET = pa.GET;
        let ADD = pa.ADD;
        let REMOVE = pa.REMOVE;

        return {
            [GET]: async function (object) {
                return `${prop.name} is ${JSON.stringify(object.get(prop.name))}`;
            },
            [ADD]: async function (object, value) {
                let arr = object.get(prop.name);
                arr.push(value);
                return `added ${value} to ${prop.name}, is now ${JSON.stringify(arr)}`;
            },
            [REMOVE]: async function (object, value) {
                let arr = object.get(prop.name);
                let index = arr.indexOf(value);
                if (index > -1) {
                    arr.splice(index, 1);
                    return `removed ${value} from ${prop.name}, is now ${JSON.stringify(arr)}`;
                } else {
                    return `${value} not found in ${prop.name}`;
                }
            }
        }
    }

    static makeStringFunction(prop) {
        let pa = PropertyMagic.PropertyActions();
        let SET = pa.SET;
        let GET = pa.GET;
        let ADD = pa.ADD;
        let REMOVE = pa.REMOVE;

        return {
            [SET]: async function (object, value) {
                object.set(prop.name, value);
                return `set ${prop.name} to ${value}`;
            },
            [GET]: async function (object) {
                return `${prop.name} is ${object.get(prop.name)}`;
            },
            [ADD]: async function (object, value) {
                let curr = object.get(prop.name);
                object.set(prop.name, curr + value);
                return `added, ${prop.name} is now ${object.get(prop.name)}`;
            },
            [REMOVE]: async function (object) {
                object.set(prop.name, prop.default);
                return `deleted ${prop.name}`;
            }
        }
    }

    static actionMap(properties) {
        let ret = {};
        let props =  Object.values( properties );
        for (var i = 0; i < props.length; i++) {
            let prop = props[i];
            if ( prop ) {
                if (prop.isa === 'String') {
                    ret[prop.name] = PropertyMagic.makeStringFunction(prop);
                } else if (prop.isa === 'Array') {
                    ret[prop.name] = PropertyMagic.makeArrayFunction(prop);
                } else if (prop.isa === 'Number') {
                    ret[prop.name] = PropertyMagic.makeNumberFunction(prop);
                }
            }
        }
        return ret;
    }

    async process(args, thing) {
        let name = args.property_name;
        let action = args.property_action;
        let value = args.property_value;

        try {
            let func = this.fmap[name][action];
            if (func) {
                let ret = await func(thing, value);
                if (ret == null) {
                    ret = `Property ${name} has no value yet`;
                }
                return ret;
            }
            return `Sorry, didn't know what to do with ${name} and ${action}, nothing changed.`;
        } catch (e) {
            return `Sorry, didn't know what to do with ${name} and ${action}, nothing changed`;
        }
    }
}

module.exports = PropertyMagic;