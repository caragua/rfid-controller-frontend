export function DropDownOptions(props) {
    let options;

    if (props.codes && props.name) {
        options = props.codes[props.name];
    }
    else if (props.items) {
        // options = {}
        // props.items.map(item => options[item.id] = `${item.name} (${item.location})`);
        options = props.items;
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