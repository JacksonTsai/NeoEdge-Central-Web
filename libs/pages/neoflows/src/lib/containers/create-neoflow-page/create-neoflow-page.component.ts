import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { CREATE_NEOFLOW_STEP } from '@neo-edge-web/models';
import { CreateMessageSchemaComponent } from '../../components/create-message-schema/create-message-schema.component';
import { MessageLinkDatasourceComponent } from '../../components/message-link-datasource/message-link-datasource.component';
import { MessageLinkDestinationComponent } from '../../components/message-link-destination/message-link-destination.component';
import { NeoflowProfileComponent } from '../../components/neoflow-profile/neoflow-profile.component';
import { SelectDataProviderComponent } from '../../components/select-data-provider/select-data-provider.component';
import { SelectMessageDestinationComponent } from '../../components/select-message-destination/select-message-destination.component';
import { CreateNeoFlowsStore } from '../../stores/create-neoflows.store';

@Component({
  selector: 'ne-create-neoflow-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CreateMessageSchemaComponent,
    MessageLinkDatasourceComponent,
    MessageLinkDestinationComponent,
    NeoflowProfileComponent,
    SelectMessageDestinationComponent,
    SelectDataProviderComponent
  ],
  templateUrl: './create-neoflow-page.component.html',
  styleUrl: './create-neoflow-page.component.scss',
  providers: [CreateNeoFlowsStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateNeoflowPageComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  isStepperEditable = true;
  #fb = inject(FormBuilder);
  #createNeoFlowStore = inject(CreateNeoFlowsStore);

  form: UntypedFormGroup;
  processorVerOpt = this.#createNeoFlowStore.neoflowProcessorVers;
  otProfileList = this.#createNeoFlowStore.otProfileList;
  itProfileList = this.#createNeoFlowStore.itProfileList;

  get currentStepperId() {
    return this.stepper?.selectedIndex ?? 0;
  }

  get stepperName() {
    return CREATE_NEOFLOW_STEP[this.currentStepperId];
  }

  get createDisabled() {
    return false;
  }

  get nextBtnDisabled() {
    if (this.stepper) {
      return this.form.get(this.stepperName).invalid;
    }
    return false;
  }

  onBackStep = () => {
    this.stepper.previous();
  };

  onNextStep = () => {
    this.stepper.next();
  };

  onCreateNeoFlow = () => {};

  ngOnInit() {
    this.form = this.#fb.group({
      profile: [],
      selectDataProvider: []
    });
  }
}
