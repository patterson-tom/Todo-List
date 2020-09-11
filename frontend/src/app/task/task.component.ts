import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskService } from '../task.service';
import { Task } from './task.types';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input() task: Task;
  @Input() task_list: TaskListComponent;
  edit = false;

  @ViewChild('sub_task_list') sub_task_list;

  constructor(private task_service: TaskService) { }

  async ngOnInit() {
    this.task.deadline = new Date(this.task.deadline);
    
    if (this.task.new) {
      this.edit = true;
    }
  }
  editClicked(){
    this.edit = !this.edit;
    if (!this.edit){
      this.task_service.updateTask(this.task);
      this.task_list.sort_tasks();
    }
  }

  delete(){
    this.task_list.delete_task(this.task);
  }

  addSubtask(){
    this.sub_task_list.add_task();
  }

  completeTask(){
    this.task.complete = true;
    this.task_service.updateTask(this.task);
    this.task_list.sort_tasks();
  }

  uncompleteTask(){
    this.task.complete = false;
    this.task_service.updateTask(this.task);
    this.task_list.sort_tasks();
  }

  dateChanged(event){
    this.task.deadline = event.value;
  }

  getDeadlineString(){
    return this.task.deadline.toDateString();
  }

  setEdit(edit){
    this.edit = edit;
  }

  isOverdue(){
    if (this.task.complete) {
      return false;
    }
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now > this.task.deadline;
  }

}
