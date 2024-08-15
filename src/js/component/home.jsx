import React, { useEffect, useState } from "react";
import { CreateTasks } from "../utils/CreateTasks";
import { List } from "../utils/List";

const Home = () => {
    const [input, setInput] = useState("");
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState("");
    const [madeUser, setMadeUser] = useState(false);
    const [userExists, setUserExists] = useState(false);

    const handleInput = (e) => {
        setInput(e.target.value);
    };

    const handleMakeTasks = async () => {
        if (!input.trim()) {
            return alert("Ingresa un texto válido");
        }
        if (!user) {
            return alert("Primero crea un usuario");
        }

        const request = await fetch(`https://playground.4geeks.com/todo/todos/${user}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                label: input,
                is_done: false
            })
        });

        const response = await request.json();
        setTasks([...tasks, response]);
        setInput("");
    };

    const handleDelete = async (taskId) => {
        await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const filteredTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(filteredTasks);
    };

    const validateUser = async () => {
        if (!user.trim()) {
            return alert("Ingresa un nombre de usuario válido");
        }
    
        try {
            const request = await fetch(`https://playground.4geeks.com/todo/users/${user}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (request.ok) {
                const response = await request.json();
                setUserExists(true);
            } else {
                await createUser();
                setMadeUser(true);
                localStorage.setItem("user", user);  
                alert('Usuario creado con éxito!');
                ShowTodos();
                window.location.reload();
            }
        } catch (error) {
            console.error("Error validando usuario:", error);
        }
    };
    

    const createUser = async () => {
        const request = await fetch(`https://playground.4geeks.com/todo/users/${user}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const response = await request.json();
        setUser(response.name);
    };

    const ShowTodos = async () => {
        const request = await fetch(`https://playground.4geeks.com/todo/users/${user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await request.json();
        setTasks(response.todos);
    };

    const deleteAll = async () => {
        const deleteTaskPromises = tasks.map(async (task) => {
            await fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        });
        setTasks([]);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(storedUser);
            setMadeUser(true);
        }
    }, []);

    useEffect(() => {
        if (user) {
            ShowTodos();
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser("");
        setMadeUser(false);
        setTasks([]);
        setUserExists(false);
    };

    return (
        <>
            {!madeUser ? (
                <form className="w-50 d-flex m-auto flex-column p-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Nombre de Usuario:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            aria-describedby="userHelp"
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </div>
                    
                    {userExists ? (
                        <button type="submit" className="btn btn-primary" onClick={() => {
                            setMadeUser(true);
                            localStorage.setItem("user", user);
                            ShowTodos(); 
                        }}>
                            Login
                        </button>
                    ) : (
                        <button type="submit" className="btn btn-primary" onClick={validateUser}>
                            Crear usuario
                        </button>
                    )}
                </form>
            ) : (
                <div className="container d-flex flex-column align-items-center ">
                <div className="text-center mb-4">
                    <p className="fs-4 fw-bold">Tu usuario es: <span className="text-primary">{user}</span></p>
                </div>
                <div className="d-flex flex-column align-items-center w-100">
                    <button className="btn btn-secondary mb-3" onClick={handleLogout}>
                        Desloguearse
                    </button>
                    <CreateTasks 
                        input={input} 
                        handleInput={handleInput} 
                        handleMakeTasks={handleMakeTasks} 
                    />
                    <List 
                        tasks={tasks} 
                        handleDelete={handleDelete} 
                    />
                    <button 
                        className="btn btn-danger" 
                        onClick={deleteAll}
                    >
                        Eliminar todos
                    </button>
                </div>
            </div>
            )}
        </>
    );
};

export default Home;
