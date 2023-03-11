import React, { useEffect, useState } from 'react'
import { Employees, Tasks, Department } from './data.js'
import EmployeeTable from './EmployeeTable.js'

const App = () => {
  const [employees, setEmployees] = useState(Employees);
  const [tasks, setTasks] = useState(Tasks);
  const [department, setDepartment] = useState(Department);

  //Modals for Employees
  const [addEmpModal, setAddEmpModal] = useState(false);
  const [deleteEmpModal, setDeleteEmpModal] = useState(false);
  const [updateEmpModal, setUpdateEmpModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  //Modals for Tasks
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [deleteTaskModal, setDeleteTaskModal] = useState(false);
  const [updateTaskModal, setUpdateTaskModal] = useState(false);

  //console.log(employees);
  //console.log(tasks);
  
  //Sort Employees by tasks completed
  employees.sort((a, b) => {return b.tasksDone - a.tasksDone});
  console.log(employees);

  //Filter first 5 employees
  const filteredEmp = employees.slice(0,5);
  console.log(filteredEmp);

  //Keep track of Tasks sum
  let TasksSum = employees.reduce((acc, employee) => acc + Number(employee.tasksDone), 0)
  useEffect(() => {
    TasksSum = employees.reduce((acc, employee) => acc + Number(employee.tasksDone), 0);
  }, [employees])
  console.log(TasksSum);

  let empIdNew = employees.length+1; // employeeId is increased by one in the beginning, so that new Employee won't have duplicate id

  //handling inputs altogether
  const [newEmployee, setNewEmployee] = useState({
    empId: empIdNew,
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    salary: '',
    tasksDone: ''
  });
  const changeHandler = (e) => {
    setNewEmployee({...newEmployee, [e.target.name]: e.target.value})
    console.log(newEmployee);
  }

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    deadline: ''
  })
  const changeTaskHandler = (e) => {
    setNewTask({...newTask, [e.target.name]: e.target.value});
    console.log(newTask);
  }

  //Insert custom data into local storage
  localStorage.setItem('employees', JSON.stringify(employees));
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('department', JSON.stringify(department));

  //const employeesObject = JSON.parse(localStorage.getItem('employees'));



  //Delete Employee
  const handleDelete = (id) => {
    setDeleteEmpModal(true);
    setEmployeeId(id);
    const taskOfDeleted = tasks.find(task => task.assignee === id);
    setNewTask({title: taskOfDeleted?.title || '', description: taskOfDeleted?.description || '', assignee: '', deadline: taskOfDeleted?.deadline || ''});
    //console.log(taskOfDeleted);
  }

  const deleteEmp = () => {
    let newEmployees = employees.filter((employee) => employee.empId !== employeeId);
    setEmployees(newEmployees);
    updateTask();
    setDeleteEmpModal(false);
    setEmployeeId(null);
    localStorage.setItem('employees', JSON.stringify(employees));
  }
  /* console.log(employees);
  console.log(employeeId); */


  //Add Employee
  const handleAddEmploye = () => {
    const newEmployeeData = {empId: newEmployee.empId, fullName: newEmployee.fullName, email:newEmployee.email, phone:newEmployee.phone, birthDate: newEmployee.birthDate, salary: newEmployee.salary, tasksDone: newEmployee.tasksDone}
    if(newEmployeeData.fullName !== '' && newEmployeeData.email !== '' && newEmployeeData.phone !== '' && newEmployeeData.birthDate !== '' && newEmployeeData.salary !== '' && newEmployee.tasksDone !== ''){
      setEmployees([...employees, newEmployeeData]);
      localStorage.setItem('employees', JSON.stringify(employees));
      setNewEmployee({empId: empIdNew+1, fullName: '', email: '', phone: '', birthDate: '', salary: '', tasksDone: ''}) //increase employeeId by one once the new employee is added
      setAddEmpModal(!addEmpModal);
    }
    else{
      alert('Fill all fields')
    }
  }

  //Update Employee
  const handleUpdate = (id) => {
    setUpdateEmpModal(true);
    setEmployeeId(id);
    const empForUpdate = employees.find(employee => employee.empId === id);
    /* console.log(empForUpdate)
    console.log(empForUpdate.empId, empForUpdate.fullName); */
    setNewEmployee({empId: empForUpdate.empId, fullName: empForUpdate.fullName, email: empForUpdate.email, phone: empForUpdate.phone, birthDate: empForUpdate.birthDate, salary: empForUpdate.salary, tasksDone: empForUpdate.tasksDone})
    
  }
  const updateEmployee = () => {
    console.log('hi');
    setEmployees(employees => {
      const newEmp = employees.map((employee) => {
        if(employee.empId === newEmployee.empId){
          return {...employee, fullName: newEmployee.fullName, email: newEmployee.email, phone: newEmployee.phone, birthDate: newEmployee.birthDate, salary: newEmployee.salary, tasksDone: newEmployee.tasksDone }
        }
        return employee;
      })
      return newEmp;
    });
    localStorage.setItem('employees', JSON.stringify(employees));
    setNewEmployee({empId: empIdNew, fullName: '', email: '', phone: '', birthDate: '', salary: '', tasksDone: ''}) //this line resets Employee data for update state
    setUpdateEmpModal(false);
    setEmployeeId(null);
  }


  //Add task
  const handleTaskAdd = (id) => {
    console.log(id);
    setAddTaskModal(true);
    setEmployeeId(id);
    console.log(employeeId);
    //const empForUpdate = employees.find(employee => employee.empId === id);
  }

  
  const addTask = () => {
    const newTaskData = {title: newTask.title, description: newTask.description, assignee: employeeId, deadline: newTask.deadline}
    if(newTaskData.title !== '' && newTaskData.description !== '' && newTaskData.deadline!== ''){
      setTasks([...tasks, newTaskData]);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      setNewTask({title: '', description: '', assignee: '', deadline: ''});
      setAddTaskModal(false);
      setEmployeeId(null);
    }
    else{
      alert('Fill all fields!');
    }
  }

  //Delete task
  const handleDeleteTask = (id) => {
    setEmployeeId(id);
    setDeleteTaskModal(true);
  }
  const deleteTask = () => {
    let newTasks = tasks.filter((task) => task.assignee !== employeeId);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    setDeleteTaskModal(false);
    setEmployeeId(null);
  }

  //Update task
  const handleUpdateTask = (id) => {
    setEmployeeId(id);
    setUpdateTaskModal(true);
    const taskForUpdate = tasks.find((task) => task.assignee === id);
    setNewTask({title: taskForUpdate.title, description: taskForUpdate.description, assignee: id, deadline: taskForUpdate.deadline});
  }
  //console.log(newTask);

  const updateTask = () => {
    setTasks(tasks => {
      const newTsk = tasks.map((task) => {
        if(task.assignee === employeeId){
          return {...task, title: newTask.title, description: newTask.description, deadline: newTask.deadline, assignee: newTask.assignee}
        }
        return task;
      })
      return newTsk;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    setNewTask({title: '', description: '', assignee: '', deadline: ''});
    setUpdateTaskModal(false);
    setEmployeeId(null);
    console.log(newTask)
  }

  //console.log(tasks);
  

  return (
    <div className='main'>
      <div className='content'>
        <h1>Employee Management</h1>
        <button className='btn-add' onClick={() =>setAddEmpModal(!addEmpModal)}>Add Employee</button>
        <table>
            <tbody>
                <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date of birth</th>
                    <th>Salary</th>
                    <th>Task</th>
                    <th>Department</th>
                    <th>Tasks Done</th>
                    <th>Action</th>
                </tr>
                {filteredEmp.map((employee) => (
                  <EmployeeTable employee={employee} key={employee.empId} id={employee.empId} deleteEmployee={handleDelete} updateEmployee={handleUpdate} addTask={handleTaskAdd} deleteTask={handleDeleteTask} updateTask={handleUpdateTask} tasksSum={TasksSum}/>
                ))}
            </tbody>
          </table>
      </div>
      {addEmpModal && (
        <>
        <div className='overlay' onClick={() =>setAddEmpModal(false)}/>
        <div className='add-modal'>
          <button className='btn-close-modal' onClick={() =>setAddEmpModal(!addEmpModal)}>✖</button>
          <div className='add-modal-content'>
            <h2>Add Employee</h2>
            <input type="text" name='fullName' onChange={changeHandler} placeholder="Full Name"/>
            <input type="text" name='email' onChange={changeHandler} placeholder="Email"/>
            <input type="text" name='phone' onChange={changeHandler} placeholder="Phone"/>
            <input type="text" name='birthDate' onChange={changeHandler} placeholder="Date of birth"/>
            <input type="text" name='salary' onChange={changeHandler} placeholder="Salary"/>
            <input type="number" name='tasksDone' onChange={changeHandler} placeholder="Tasks Done" />
            <button className='add' onClick={() => handleAddEmploye()}>Add</button>
          </div>
      </div>
      </>
      )}
      {deleteEmpModal && (
        <>
        <div className='overlay' onClick={() => {setDeleteEmpModal(false); setEmployeeId(null); setNewTask({title: '', description: '', assignee: '', deadline: ''})}}/>
        <div className='delete-modal'>
          <button className='btn-close-modal' onClick={() => {setDeleteEmpModal(false); setEmployeeId(null); setNewTask({title: '', description: '', assignee: '', deadline: ''})}}>✖</button>
          <div className='del-modal-content'>
            <h2>Are you sure you want to delete this employee?</h2>
            <div className='cta-btns'>
              <button className='btn-yes' onClick={() => deleteEmp()}>Yes</button>
              <button className='btn-no' onClick={() => {setDeleteEmpModal(false); setEmployeeId(null); setNewTask({title: '', description: '', assignee: '', deadline: ''})}}>No</button>
            </div>
          </div>
        </div>
      </>
      )}
      {updateEmpModal && (
        <>
        <div className='overlay' onClick={() => {setUpdateEmpModal(false); setEmployeeId(null); setNewEmployee({empId: empIdNew, fullName: '', email: '', phone: '', birthDate: '', salary: '', tasksDone: ''})}}/>
        <div className='add-modal'>
          <button className='btn-close-modal' onClick={() => {setUpdateEmpModal(false); setEmployeeId(null); setNewEmployee({empId: empIdNew, fullName: '', email: '', phone: '', birthDate: '', salary: '', tasksDone: ''})}}>✖</button>
          <div className='add-modal-content'>
            <h2>Update Employee</h2>
              <input type="text" name='fullName' onChange={changeHandler} placeholder="Full Name" value={newEmployee.fullName || ''}/>
              <input type="text" name='email' onChange={changeHandler} placeholder="Email" value={newEmployee.email || ''}/>
              <input type="text" name='phone' onChange={changeHandler} placeholder="Phone" value={newEmployee.phone || ''}/>
              <input type="text" name='birthDate' onChange={changeHandler} placeholder="Date of birth" value={newEmployee.birthDate || ''}/>
              <input type="text" name='salary' onChange={changeHandler} placeholder="Salary" value={newEmployee.salary || ''}/>
              <input type="number" name='tasksDone' onChange={changeHandler} placeholder="Tasks Done" value={newEmployee.tasksDone || ''}/>
              <button className='add' onClick={() => updateEmployee()}>Update</button>
          </div>
        </div>
        </>
      )}
      {addTaskModal && (
        <>
        <div className='overlay' onClick={() => {setAddTaskModal(false);}}/>
        <div className='add-modal'>
          <button className='btn-close-modal' onClick={() => {setAddTaskModal(false); setEmployeeId(null); setNewEmployee({empId: empIdNew, fullName: '', email: '', phone: '', birthDate: '', salary: ''})}}>✖</button>
          <div className='add-modal-content'>
            <h2>Add Task</h2>
              <input type="text" name='title' onChange={changeTaskHandler} placeholder="Task Title" value={newTask.title || ''}/>
              <input type="text" name='description' onChange={changeTaskHandler} placeholder="Description" value={newTask.description || ''}/>
              <input type="text" name='deadline' onChange={changeTaskHandler} placeholder="Deadline" value={newTask.deadline || ''}/>
              <button className='add' onClick={() => addTask()}>Add</button>
          </div>
        </div>
        </>
      )}
      {deleteTaskModal && (
        <>
        <div className='overlay' onClick={() => {setDeleteTaskModal(false)}}/>
        <div className='delete-modal'>
          <button className='btn-close-modal' onClick={() => {setDeleteTaskModal(false);}}>✖</button>
          <div className='del-modal-content'>
            <h2>Are you sure you want to delete this task?</h2>
            <div className='cta-btns'>
              <button className='btn-yes' onClick={() => deleteTask()}>Yes</button>
              <button className='btn-no' onClick={() => {setDeleteTaskModal(false);}}>No</button>
            </div>
          </div>
        </div>
        </>
      )}
      {updateTaskModal && (
        <>
        <div className='overlay' onClick={() => {setUpdateTaskModal(false); setNewTask({title: '', description: '', assignee: '', deadline: ''})}}/>
        <div className='add-modal'>
          <button className='btn-close-modal' onClick={() => {setUpdateTaskModal(false); setNewTask({title: '', description: '', assignee: '', deadline: ''})}}>✖</button>
          <div className='add-modal-content'>
            <h2>Update Task</h2>
              <input type="text" name='title' onChange={changeTaskHandler} placeholder="Task Title" value={newTask.title || ''}/>
              <input type="text" name='description' onChange={changeTaskHandler} placeholder="Description" value={newTask.description || ''}/>
              <input type="text" name='deadline' onChange={changeTaskHandler} placeholder="Deadline" value={newTask.deadline || ''}/>
              <button className='add' onClick={() => updateTask()}>Update</button>
          </div>
        </div>
        </>
      )}
      
    </div>
  )
}

export default App
