import styles from './Project.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect} from 'react'
import { parse, v4 as uuidv4} from 'uuid'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../project/service/ServiceForm'
import ServiceCard from '../project/service/ServiceCard'

function Project(){

    const {id} = useParams()
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState('')
    const [typeMessage, setTypeMessage] = useState('')

    function showMessage(msg, type){
        setMessage(" ")
        setTypeMessage(type)
        setMessage(msg)
    }

    function updateData(project){
        setProject(project)
        setServices(project.services)
    }

    useEffect(() => {
        fetch(`http://localhost:5000/projects/${id}`,{
            method:"GET",
            headers:{'Content-type': 'application/json'}
        })
        .then((resp) => resp.json())
        .then((data) => updateData(data))
        .catch((err) => console.log(err))                
    },[])

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }

    function editPost(project){
        if(project.budget < project.cost){
            showMessage('O orçamento deve ser maior que o custo do projeto','error')
            return
        }

        fetch(`http://localhost:5000/projects/${id}`,{
            method:"PATCH",
            headers:{'Content-type': 'application/json'},
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            updateData(data)
            showMessage('Projeto atualizado com sucesso','sucess')
        })
        .catch((err) => console.log(err))               
    }

    function createService(project){
        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()
        const newCost = parseFloat(project.cost) + parseFloat(lastService.cost)

        if(newCost > parseFloat(project.budget)){
            showMessage('Serviço irá utrapassar o valor do orçamento','error')
            project.services.pop()
            return false
        }

        project.cost = newCost        
        editPost(project)
        setShowServiceForm(false)
    }

    function removeService(id,cost){
        project.cost -= cost
        project.services = project.services.filter((service) => service.id !== id)
        editPost(project)          
    }

    return (        
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass='columns'>
                        {message !== '' && <Message msg={message} type={typeMessage} />} 
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p><span>Categoria:</span> {project.category.name}</p>
                                    <p><span>Total de Orçamento:</span> R${project.budget}</p>
                                    <p><span>Total Utilizado:</span> R${project.cost}</p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm 
                                        handleSubmit={editPost} 
                                        btnText="Editar Projeto"
                                        projectData={project}/>
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm 
                                        handleSubmit={createService}
                                        btnText="Adicionar Serviço"
                                        projectData={project}
                                    />
                                )}                            
                            </div>                                                        
                        </div>   
                        <Container customClass="start">                             
                            <h2>Serviços</h2>          
                        </Container>                                                                               
                        <Container customClass="start">     
                            {services.length > 0 && (
                                services.map((serv) => (
                                    <ServiceCard
                                    id={serv.id}
                                    name={serv.name}
                                    cost={serv.cost}
                                    description={serv.description}
                                    key={serv.id}
                                    handleRemove={removeService}
                                />
                                ))
                            )}
                            {services.length <= 0 && <p>Não há serviços cadastrados</p>}
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading/>
            )}
        </>
    )
}

export default Project