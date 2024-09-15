import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

import styles from './Projects.module.css'

import Message from '../layout/Message'
import Container from '../layout/Container'
import LinkButton from '../layout/LinkButton'
import ProjectCard from '../project/ProjectCard'
import Loading from '../layout/Loading'

function Projects(){
    const [projects, setProjects] = useState([])
    const [removerLoading, setRemoveLoading] = useState(false)
    const [message, setMessage] = useState('')
    const location = useLocation()    

    useEffect(() => {
        if (location.state){
            setMessage(location.state.message)
        }    

        setTimeout(() => {
            fetch("http://localhost:5000/projects",{
                method:"GET",
                headers:{'Content-type': 'application/json'}
            })
            .then((resp) => resp.json())
            .then((data) => {
                setProjects(data)
                setRemoveLoading(true)
            })
            .catch((err) => console.log(err))
        },3000)
    },[])

    function removerProject(id){
        fetch(`http://localhost:5000/projects/${id}`,{
            method:"DELETE",
            headers:{'Content-type': 'application/json'}
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProjects(projects.filter((project) => project.id !== id))            
            setMessage('Projeto excluído com sucesso!')
        })
        .catch((err) => console.log(err))        
    }

    return (
        <div className={styles.project_container}>            
            <div className={styles.title_container}> 
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projetos" />                    
            </div>
            {message && <Message msg={message} type='sucess' seconds={5}/>}
            <Container customClass='start'>
                {projects.length > 0 &&
                    projects.map((project) =>  
                    <ProjectCard 
                        id={project.id}
                        name={project.name}
                        budget={project.budget}
                        category={project.category.name}
                        key={project.id}
                        handleRemove={removerProject}
                    />)
                }
                {!removerLoading && <Loading/>}
                {removerLoading && projects.length === 0 && (
                    <p>Não há projetos cadastrados!</p>
                )}
            </Container>
        </div>
    )
}

export default Projects