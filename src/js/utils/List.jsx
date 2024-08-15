import React from 'react'
import { Items } from './Items'

export const List = ({tasks,handleDelete}) => {
    return (
        <ul className="list-group w-50 mx-auto mt-4" style={{ height: '40vh', overflowY: 'auto' }}>
            {tasks.length > 0 ? tasks.map((task) => (
                <Items task={task.label} index={task.id} handleDelete={handleDelete} ></Items>
            )) : (
                <li className="list-group-item text-center">
                    Lista de tareas vacía
                </li>
            )}
        </ul>
    )
}
