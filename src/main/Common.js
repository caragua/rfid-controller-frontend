export function DropDownOptions(props) {
    let options;

    if (props.codes && props.name) {
        options = props.codes[props.name];
    }
    else if (props.items) {
        if (props.name) {
            options = {}
            Object.keys(props.items).map(key => {
                options[key] = props.items[key][props.name];
            });
        }
        else {
            options = props.items;
        }
    }
    else {
        return false;
    }
    
    return (
        <>
            {
                Object.keys(options).map((key, index) => {
                    let item = options[key];
                    return <option key={index} value={key}>{item}</option>
                })
            }
        </>
    )
}