import React, { useState } from 'react'
import {BsFillPencilFill} from 'react-icons/bs';
import {BsTrash3Fill} from 'react-icons/bs';
import {MdOutlineAddTask} from 'react-icons/md'

const EmployeeTable = ({ employee, id, deleteEmployee, updateEmployee, addTask, deleteTask, updateTask, tasksSum }) => {

  const tasksObject = JSON.parse(localStorage.getItem('tasks'));
  const employeeTask = tasksObject.find(task => task.assignee === id);

  const departmentObject = JSON.parse(localStorage.getItem('department'));
  const employeeDepartment = departmentObject.find(dep => dep.dpId === employee.department);
  /* console.log(employeeTask?.title) */

  
  return (
    <tr>
        <td>{employee.fullName}</td>
        <td>{employee.email}</td>
        <td>{employee.phone}</td>
        <td>{employee.birthDate}</td>
        <td>{employee.salary}$</td>
        <td>{employeeTask ? employeeTask?.title : '/'}
          <div className='task-btn-container'>{employeeTask ? '' : <button className='task-btn upd' onClick={() => addTask(id)}><MdOutlineAddTask/></button>}
         {!employeeTask ? '' : <button className='task-btn upd' onClick={() => updateTask(id, employeeTask.title)}><BsFillPencilFill/></button>}
          {!employeeTask ? '' : <button className='task-btn del' onClick={() => deleteTask(id)}><BsTrash3Fill/></button>}</div>
        </td>
        <td>{employeeDepartment ? employeeDepartment?.title : 'no department'}</td>
        <td>{employee.tasksDone ? Math.floor(employee.tasksDone / tasksSum * 100) : 0}%</td>
        <td>
          <div className="cta-btns">
            <button className='btn-update' onClick={() => updateEmployee(id)}>Update</button>
            <button className='btn-delete' onClick={() => deleteEmployee(id)}>Delete</button>
          </div>
        </td>
    </tr>
  )
}

export default EmployeeTable