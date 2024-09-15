import styles from '../ProjectForm.module.css'
import Input from '../../form/Input'
import SubmitButton from '../../form/SubmitButton'
import { useState } from 'react'

function ServiceForm({handleSubmit, btnText, projectData}){

    const [service, setService] = useState({})

    function handleChange(e){
        setService({...service, [e.target.name]: e.target.value})
    }

    function submit(e){
        e.preventDefault()        
        projectData.services.push(service)
        console.log(projectData)
        handleSubmit(projectData)
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Nome do Serviço"
                name="name"
                placeholder="Insira o nome do serviço"
                handleOnChange={handleChange}
            />
            <Input
                type="number"
                text="Custo"
                name="cost"
                placeholder="Insira o custo do serviço"
                handleOnChange={handleChange}
            />        
            <Input
                type="text"
                text="Descrição do Serviço"
                name="description"
                placeholder="Descreva serviço"
                handleOnChange={handleChange}
            />                
            <SubmitButton text={btnText}/>
        </form>
    )
}

export default ServiceForm