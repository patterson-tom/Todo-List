import { Component, OnInit, Input } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task/task.types';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  task_list: Task[] = [];
  @Input() parentID = "root";

  sorting_method = "Soonest";

  constructor(private task_service: TaskService) { }

  async ngOnInit() {
    this.task_list = await this.task_service.getTasks(this.parentID);
    this.task_service.sorting_method.subscribe(method => {
      this.sorting_method = method;
      this.sort_tasks();
    });
  }

  async add_task(){
    let new_task: Task = {title: "", content: "", deadline: new Date(), new: true, complete: false, parent: this.parentID};
    this.task_list.unshift(new_task);
    this.task_list[0]['_id'] = (await this.task_service.addTask(new_task))['_id'];
    this.sort_tasks();
  }

  delete_task(task: Task){
    this.task_list.splice(this.task_list.indexOf(task), 1);
    this.task_service.deleteTask(task);
  }

  sort_tasks() {
    switch(this.sorting_method){
      case "Soonest":
        this.task_list.sort((el1, el2) => el1.deadline.getTime() - el2.deadline.getTime());
        break;
      case "Least Soonest":
        this.task_list.sort((el1, el2) => el2.deadline.getTime() - el1.deadline.getTime());
        break;
      case "Completed":
        this.task_list.sort((el1, el2) => (el1.complete === el2.complete) ? 0 : (el1.complete ? -1 : 1));
        break;
      case "Uncompleted":
        this.task_list.sort((el1, el2) => (el1.complete === el2.complete) ? 0 : (el1.complete ? 1 : -1));
        break;
    }
  }

}
