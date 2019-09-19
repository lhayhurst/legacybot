class FamilyPropertyMagic {
    static StringProperties() {
        //todo -- refactor this to reflect on the schema and get out the strings
        return  ['name', 'notes', 'lifestyle', 'doctrine', 'role_move'];
    }

    static ArrayofStringProperties() {
        return  ['traditions', 'assets', 'moves', 'needs', 'surpluses' ];

    }
};

class PropertyMagic {

    static FamilyStringProperties() {
        return FamilyPropertyMagic.StringProperties();
    }

    static FamilyArrayofStringProperties() {
        return FamilyPropertyMagic.ArrayofStringProperties();
    }

    static FamilyProperties() {
        return [...FamilyPropertyMagic.StringProperties(), ...FamilyPropertyMagic.ArrayofStringProperties()];
    }

    static PropertyActions() {
        return {
            SET: 'set',
            GET: 'get',
            ADD: 'add',
            REMOVE: 'remove'
        };
    };
    constructor(simpleStringProperties, arrayOfStringProperties) {
        this.fmap = PropertyMagic.actionMap(simpleStringProperties, arrayOfStringProperties);
    }
    static actionMap(simpleStringProperties, arrayOfStringProperties) {
        let pa = PropertyMagic.PropertyActions();
        let SET = pa.SET;
        let GET = pa.GET;
        let ADD = pa.ADD;
        let REMOVE = pa.REMOVE;

        let ret = {};
        for( var i = 0; i < simpleStringProperties.length; i++ ) {
            let prop = simpleStringProperties[i];
            ret[prop] = {
                [SET]: async function (family, value) {
                    family.set(prop, value);
                    return `set ${prop} to ${value}`;
                },
                [GET]: async function (family) {
                    return `${prop} is ${family.get(prop)}`;
                },
                [ADD]: async function (family, value) {
                    let curr = family.get( prop );
                    family.set(  prop, curr + value );
                    return `added, ${prop} is now ${family.get(prop)}`;
                },
                [REMOVE]: async function (family) {
                    family.set(prop, null);
                    return `deleted ${prop}`;
                }
            }
        }
        for( var j = 0; j < arrayOfStringProperties.length; j++) {
            let prop = arrayOfStringProperties[j];
            ret[prop] = {
                [GET]: async function (family) {
                    return `${prop} is ${JSON.stringify( family.get(prop) ) }`;
                },
                [ADD]: async function (family, value) {
                    let arr = family.get( prop );
                    arr.push( value );
                    return `added ${value} to ${prop}, is now ${JSON.stringify(arr)}`;
                },
                [REMOVE]: async function (family, value) {
                    let arr = family.get(prop);
                    let index = arr.indexOf(value);
                    if (index > -1) {
                        arr.splice(index, 1);
                        return `removed ${value} from ${prop}, is now ${JSON.stringify(arr)}`;
                    }
                    else {
                        return `${value} not found in ${prop}`;
                    }
                }
            }
        }
        return ret;
    }

    async process(args, family) {
        let name = args.property_name;
        let action = args.property_action;
        let value = args.property_value;

        let dirty = false;
        try {
            let func = this.fmap[name][action];
            if (func) {
                let ret = await func(family, value);
                if (dirty) {
                    await family.save();
                }
                if (ret == null) {
                    ret = `Family property ${name} has no value yet`;
                }
                return ret;
            }
            return `Sorry, didn't know what to do with ${name} and ${action}, nothing changed.`;
        } catch (e) {
            return `Sorry, didn't know what to do with ${name} and ${action}, nothing changed`;
        }
    }
}

module.exports =  PropertyMagic;