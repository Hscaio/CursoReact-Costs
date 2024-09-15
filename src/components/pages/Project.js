import styles from './Project.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect} from 'react'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'

function Project(){

    const {id} = useParams()
    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [message, setMessage] = useState('')
    const [typeMessage, setTypeMessage] = useState('')

    function showMessage(msg, type){
        setTypeMessage(type)
        setMessage(msg)
    }

    useEffect(() => {
        fetch(`http://localhost:5000/projects/${id}`,{
            method:"GET",
            headers:{'Content-type': 'application/json'}
        })
        .then((resp) => resp.json())
        .then((data) => setProject(data))
        .catch((err) => console.log(err))                
    },[])

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
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
            setProject(data)
            showMessage('Projeto atualizado com sucesso','sucess')
        })
        .catch((err) => console.log(err))               
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
                    </Container>
                </div>
            ) : (
                <Loading/>
            )}
        </>
    )
}

export default Project