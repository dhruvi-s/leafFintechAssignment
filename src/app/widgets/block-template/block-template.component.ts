import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-block-template',
  templateUrl: './block-template.component.html',
  styleUrls: ['./block-template.component.scss']
})
export class BlockTemplateComponent implements OnInit {
  message: any;
  constructor() { }

  ngOnInit() {
  }

}
