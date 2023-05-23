export default function FormErrorItem(props) {
    const render_error = () => {
        switch (props.err_code){
            case 'generic_500':
                return "An error has occured"
                break;
        }
    }
    return (
        <div className="errorItem">
            {render_error()}
        </div>
    )
}