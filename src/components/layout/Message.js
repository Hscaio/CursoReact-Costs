import styles from './Message.module.css'
import { useState, useEffect} from 'react'

function Message({type, msg, seconds}){
    const [visible, setVisible] = useState(false)
    
    useEffect(() => {
        if(!msg){
            setVisible(false)
            return
        }
        setVisible(true)
        const timer = setTimeout(() => {
            setVisible(false)
        },seconds * 1000)

        return () => clearTimeout(timer)
    },[msg])

    return(
        <>
            {visible && (
                <div className={`${styles.message} ${styles[type]}`}>
                    <p>{msg}</p>
                </div>
            )
            }
        </>
    )

}

Message.defaultProps = {
    seconds: 3
}

export default Message