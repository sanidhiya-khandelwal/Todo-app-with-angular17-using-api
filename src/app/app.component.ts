import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MasterService } from './Service/master.service';
import { ApiResponseModel, ITask, Task } from './model/task';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DatePipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  taskObj: Task = new Task();
  title = 'angular_17_todo_app_with_api';
  taskList: ITask[] = [];

  masterService = inject(MasterService)

  ngOnInit(): void {
    this.loadAlltask();
  }
  // above line is equivalent to next line in ang17
  // constructor(private master:MasterService){

  // }
  loadAlltask() {
    this.masterService.getAllTaskList().subscribe((res: ApiResponseModel) => {
      this.taskList = res.data;
    })
  }
  addTask() {
    this.masterService.addNewTask(this.taskObj).subscribe((res: ApiResponseModel) => {
      if (res.result) {
        alert('Task created successfully');
        this.loadAlltask();
        this.taskObj = new Task();//re-initialize the object once all tasks are loaded
      }
    }, error => {
      alert('API call error')
    })
  }

  // brings the data on input field
  onEdit(item: ITask) {
    this.taskObj = item; //data will come in input fields 
    setTimeout(() => {
      const dat = new Date(this.taskObj.dueDate);
      const day = ('0' + dat.getDate()).slice(-2);
      const month = ('0' + dat.getMonth()).slice(-2);
      const today = dat.getFullYear() + '-' + (month) + '-' + (day);
      (<HTMLInputElement>document.getElementById('textDate')).value = today;
    }, 10)
  }
  // updates the task with new data
  updateTask() {
    this.masterService.updateTask(this.taskObj).subscribe((res: ApiResponseModel) => {
      if (res.result) {
        alert('Task updated successfully');
        this.loadAlltask();
        this.taskObj = new Task();//re-initialize the object once all tasks are loaded
      }
    }, error => {
      alert('API call error')
    })
  }
  // deletes the task
  onDelete(id: number) {
    const isConfirm = confirm("Are you sure to delete the task");
    if (isConfirm) {
      this.masterService.deleteTask(id).subscribe((res: ApiResponseModel) => {
        if (res) {
          alert('Task deleted Successfully');
          this.loadAlltask();
          this.taskObj = new Task();
        }
      }, error => {
        alert('API call error')
      })
    }
    else { }

  }
}
