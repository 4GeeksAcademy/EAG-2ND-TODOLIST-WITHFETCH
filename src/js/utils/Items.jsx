import React from 'react';
import './ItemDisplay.css';

export const Items = ({ index, task, handleDelete }) => {
    return (
        <li key={index} className="list-group-item d-flex justify-content-between align-items-center list-group-item-action">
            <span>{task}</span>
            <button
                onClick={() => handleDelete(index)}
                className="btn btn-danger hovertrue"
            >
                <i className="fa fa-trash" style={{ color: 'black' }}></i>
            </button>
        </li>
    );
}
