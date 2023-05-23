import './FormErrors.css';
import FormErrorItem from 'components/FormErrorItem';

export default function FormErrors(props) {
    let el_errors = null

    if (props.errors.length > 0){
      el_errors = (<dib className='errors'>
        {pros.errors.map((err_code)=> {
          return <FormErrorItem err_code={err_code} />
        })} 
    </dib>)
    }
    return (
        <div className='errorsWrap'>
            {el_errors}
        </div>
    )
}