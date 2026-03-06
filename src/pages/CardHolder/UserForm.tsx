import React, { PropsWithChildren, useState } from 'react';
import Button from '../../components/ui/button/Button';
import { AccessLevelForm } from '../../components/form/card-holder/AccessLevelForm';
import { CredentialForm } from '../../components/form/card-holder/CredentialForm';
import { PersonalInformationForm } from '../../components/form/card-holder/PersonalInformationForm';
import { UserSettingForm } from '../../components/form/card-holder/UserSettingForm';
import { UserDto } from '../../model/CardHolder/UserDto';
import { FormProp, FormType } from '../../model/Form/FormProp';

interface UserFormProps extends FormProp<UserDto> {
  image: File | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
}

enum UserFormStep {
  Image,
  Personal,
  AccessLevel,
  Credential,
  Setting
}

const userFormSteps = [
  { step: UserFormStep.Image, title: 'User Image', detail: 'Upload or capture cardholder photo' },
  { step: UserFormStep.Personal, title: 'Personal Information', detail: 'Identity, contact and company details' },
  { step: UserFormStep.AccessLevel, title: 'Level & Credential', detail: 'Assign access levels for this cardholder' },
  { step: UserFormStep.Credential, title: 'Credentials', detail: 'Manage cards and activation dates' },
  { step: UserFormStep.Setting, title: 'Settings', detail: 'Set cardholder behavior flags' }
];

const UserForm: React.FC<PropsWithChildren<UserFormProps>> = ({ dto, setDto, handleClick, image, setImage, type }) => {
  const [activeStep, setActiveStep] = useState<number>(UserFormStep.Image);
  const currentStepIndex = userFormSteps.findIndex((x) => x.step === activeStep);
  const progress = ((currentStepIndex + 1) / userFormSteps.length) * 100;
  const currentStep = userFormSteps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === userFormSteps.length - 1;

  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= userFormSteps.length) return;
    setActiveStep(userFormSteps[stepIndex].step);
  };

  return (
    <div className="flex flex-col gap-5 p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="w-full">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Step {currentStepIndex + 1} of {userFormSteps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
          <div className="h-2 rounded-full bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-2">
          {userFormSteps.map((step, index) => (
            <button
              key={step.step}
              type="button"
              onClick={() => goToStep(index)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                activeStep === step.step
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:border-brand-400 dark:bg-brand-400/20 dark:text-brand-300'
                  : 'border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{index + 1}.</span>
              <span>{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800 lg:p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentStep?.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{currentStep?.detail}</p>
        </div>

        {activeStep === UserFormStep.Image && (
          <PersonalInformationForm
            type={type}
            dto={dto}
            setDto={setDto}
            handleClick={handleClick}
            image={image}
            setImage={setImage}
            section="image"
          />
        )}

        {activeStep === UserFormStep.Personal && (
          <PersonalInformationForm
            type={type}
            dto={dto}
            setDto={setDto}
            handleClick={handleClick}
            image={image}
            setImage={setImage}
            section="personal"
          />
        )}

        {activeStep === UserFormStep.AccessLevel && (
          <AccessLevelForm type={type} dto={dto} setDto={setDto} handleClick={handleClick} />
        )}

        {activeStep === UserFormStep.Credential && (
          <CredentialForm type={type} dto={dto} setDto={setDto} handleClick={handleClick} />
        )}

        {activeStep === UserFormStep.Setting && (
          <UserSettingForm type={type} dto={dto} setDto={setDto} handleClick={handleClick} />
        )}

        <div className="mt-6 flex w-full items-center justify-between gap-3">
          <div>
            {!isFirstStep && (
              <Button variant="outline" onClick={() => goToStep(currentStepIndex - 1)} className="min-w-[120px]" size="sm">
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="danger" onClickWithEvent={handleClick} name="close" className="min-w-[120px]" size="sm">
              Cancel
            </Button>
            {isLastStep ? (
              <Button
                disabled={type == FormType.INFO}
                onClickWithEvent={handleClick}
                name={type == FormType.UPDATE ? 'update' : 'create'}
                className="min-w-[120px]"
                size="sm"
              >
                {type == FormType.UPDATE ? 'Update' : 'Create'}
              </Button>
            ) : (
              <Button onClick={() => goToStep(currentStepIndex + 1)} className="min-w-[120px]" size="sm">
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
