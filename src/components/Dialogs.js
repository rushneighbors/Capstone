import {
  Box,
  Button,
  Dialog,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { confirmSignUp, getUserInfo, signIn, signUp } from "../utils/auth";
import { useUserStore } from "../Stores/UserStore";
import { useDialogStore } from "../Stores/DialogStore";
import { getAllSteps, getSteps, putInfo, putSteps } from "../APIs/UserServices";
import { useStepCountStore } from "../Stores/StepCountStore";
import { calcTotalSteps } from "../utils/calculations";

export const ParentDialog = (props) => {
  const currentUser = useUserStore((state) => state.currentUser);
  const setUser = useUserStore((state) => state.setCurrentUser);
  const setUserAttributes = useUserStore((state) => state.setUserAttributes);
  const userAttributes = useUserStore((state) => state.userAttributes);
  const setUserSubmit = useUserStore((state) => state.setUserSubmit);
  const handleClose = () => {
    props.handleClose(false);
  };

  const EntryDialog = (props) => {
    const handleClick = (button) => {
      button === "yes" ? setView(2) : setView(5);
    };
    const tooltipText =
      "The research being used for this program has not yet been done to include people outside of this age range. You are more than welcome to still utilize the service, however, results may vary.";
    return (
      <Box p={2}>
        <Stack justifyContent="center" spacing={2}>
          <Typography align="center" variant="h6">
            Are you between 19 and 40 years of age?
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => {
                handleClick("yes");
              }}
            >
              Yes
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                handleClick("no");
              }}
            >
              No
            </Button>
          </Stack>
          <Tooltip disableFocusListener title={tooltipText}>
            <Button color="info" size="small">
              Why are you asking me this?
            </Button>
          </Tooltip>
        </Stack>
      </Box>
    );
  };

  const SignUpDialog = (props) => {
    const time = new Date();

    const [inputs, setInputs] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      time: time.getTime(),
    });

    const createUser = (inputs) => {
      signUp(inputs)
        .catch((err) => alert(err))
        .then((res) => setUser(res))
        .then(() => setView(3));
    };

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState(false);

    const handleCreateSubmission = () => {
      let isFirstNameValid = inputs.firstName.match(/^[a-zA-Z](?:[ '.\-a-zA-Z]*[a-zA-Z\'\-])?$/);
      let isLastNameValid = inputs.lastName.match(/^[a-zA-Z](?:[ '.\-a-zA-Z]*[a-zA-Z\'\-])?$/);
      let isEmailValid = inputs.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
      let isPasswordValid = inputs.password.match(/^(?!\s+)(?!.*\s+$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$^*.[\]{}()?"!@#%&\\,><':;|_~`=+\- ])[A-Za-z0-9$^*.[\]{}()?"!@#%&\\,><':;|_~`=+\- ]{8,256}$/);
      let isPasswordConfirmValid = inputs.password.match(/^(?!\s+)(?!.*\s+$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$^*.[\]{}()?"!@#%&\\,><':;|_~`=+\- ])[A-Za-z0-9$^*.[\]{}()?"!@#%&\\,><':;|_~`=+\- ]{8,256}$/);

      setFirstNameError(!isFirstNameValid);
      setLastNameError(!isLastNameValid);
      setEmailError(!isEmailValid);
      setPasswordError(!isPasswordValid);
      setPasswordConfirmError(!isPasswordConfirmValid);

      if(isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid && isPasswordConfirmValid) {
          createUser(inputs);
      }
  };

    return (
      <Box p={2}>
        <Stack justifyContent="center" spacing={2}>
          <Typography align="center" variant="h6">
            Create an Account
          </Typography>
          <Stack spacing={2} justifyContent="center">
            <TextField
              size="small"
              label="First Name"
              variant="outlined"
              fullWidth
              required
              onChange={(event) => {
                const value = event.target.value;
                setInputs({ ...inputs, firstName: value });
              }}
              error={firstNameError}
              helperText={firstNameError ? "Enter a valid First Name" : ""}
            />
            <TextField
              size="small"
              label="Last Name"
              variant="outlined"
              fullWidth
              required
              onChange={(event) => {
                const value = event.target.value;
                setInputs({ ...inputs, lastName: value });
              }}
              error={lastNameError}
              helperText={lastNameError ? "Enter a valid Last Name" : ""}
            />
            <TextField
              size="small"
              label="Email Address"
              variant="outlined"
              fullWidth
              required
              onChange={(event) => {
                const value = event.target.value;
                setInputs({ ...inputs, email: value });
              }}
              error={emailError}
              helperText={emailError ? "Enter a valid Email" : ""}
            />
            <TextField
              size="small"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              required
              onChange={(event) => {
                const value = event.target.value;
                setInputs({ ...inputs, password: value });
              }}
              error={passwordError}
              helperText={passwordError ? "Enter a valid Password" : ""}
            />
            <TextField
              size="small"
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              required
              onChange={(event) => {
                const value = event.target.value;
                setInputs({ ...inputs, passwordConfirm: value });
              }}
              error={passwordConfirmError}
              helperText={passwordConfirmError ? "Passwords must match" : ""}
            />
          </Stack>
          <Stack spacing={1}>
            <Button
              variant="contained"
              onClick={handleCreateSubmission}
            >
              Create Account
            </Button>
            <Button size="small" onClick={() => setView(6)}>
              Already have an account?
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  };

  const ConfirmDialog = (props) => {
    const [code, setCode] = useState(null);

    const confirmUser = (code) => {
      confirmSignUp(currentUser.user.username, code)
        .catch((err) => alert(err))
        .then(() => setView(4));
    };

    return (
      <Box p={2}>
        <Stack justifyContent="center" spacing={2}>
          <TextField
            size="small"
            label="Verification Code"
            variant="outlined"
            fullWidth
            onChange={(event) => setCode(event.target.value)}
          />
          <Button size="small" onClick={() => confirmUser(code)}>
            Verify Email
          </Button>
        </Stack>
      </Box>
    );
  };

  const HealthDialog = (props) => {
    const today = moment().format("l");
    const { userSub } = useUserStore((state) => state.currentUser);
    const [value, setValue] = useState(moment());
    const [birthdate, setBirthdate] = useState(moment());
    const handleBirthdateChange = (newValue) => {
      setBirthdate(newValue);
      setInputs({ ...inputs, birthdate: newValue.format("l") });
    };
    const handleChange = (newValue) => {
      setValue(newValue);
      setInputs({ ...inputs, date: newValue.format("l") });
    };
    const handleRadioChange = (event) => {
      setInputs({ ...inputs, sex: event.target.value });
    };
    const [inputs, setInputs] = useState({
      birthdate: today,
      weight: null,
      heightFt: null,
      heightIn: null,
      bodyFat: null,
      targetWeight: null,
      waist: null,
      neck: null,
      sex: "",
      date: today,
    });

    const handleSubmit = () => {
      console.log(currentUser, inputs);
      putInfo(userSub, inputs).catch((err) => alert(err));
      setUserSubmit(true);
    };

    const [weightError, setWeightError] = useState(false);
    const [heightFtError, setHeightFtError] = useState(false);
    const [heightInError, setHeightInError] = useState(false);
    const [bodyFatError, setBodyFatError] = useState(false);
    const [targetWeightError, setTargetWeightError] = useState(false);
    const [waistError, setWaistError] = useState(false);
    const [neckError, setNeckError] = useState(false);

    const handleFormSubmission = () => {
      let isWeightValid = inputs.weight.match(/^\d{3}(\.\d{1,2})?$/);
      let isHeightFtValid = inputs.heightFt.match(/^\d{1}$/);
      let isHeightInValid = inputs.heightIn.match(/^\d{1,2}$/);
      let isBodyFatValid = inputs.bodyFat.match(/^\d{1,2}(\.\d{1,2})?$/);
      let isTargetWeightValid = inputs.targetWeight.match(/^\d{1,2}?$/);
      let isNeckValid = inputs.neck.match(/^\d{1,2}(\.\d{1,2})?$/);
      let isWaitValid = inputs.waist.match(/^\d{1,2}(\.\d{1,2})?$/);
  
      setWeightError(!isWeightValid);
      setHeightFtError(!isHeightFtValid);
      setHeightInError(!isHeightInValid);
      setBodyFatError(!isBodyFatValid);
      setTargetWeightError(!isTargetWeightValid);
      setNeckError(!isNeckValid);
      setWaistError(!isWaitValid);
  
      if(isWeightValid && isHeightFtValid && isHeightInValid && isBodyFatValid && isTargetWeightValid && isNeckValid && isWaitValid) {
          handleSubmit(inputs);
      }
  };

    return (
      <Box p={2}>
        <Stack justifyContent="center" spacing={2}>
          <Typography align="center" variant="h6">
            Let's get some basic info
          </Typography>
          <Typography align="center" variant="h10">
            *Required field
          </Typography>
          <Stack spacing={2} justifyContent="center">
            <Stack direction="row" spacing={1}>
              <DatePicker
                label="Birthdate"
                disableFuture
                value={birthdate}
                onChange={handleBirthdateChange}
                renderInput={(params) => (
                  <TextField fullWidth size="small" {...params} />
                )}
              />
              <TextField
                size="small"
                label="Weight (lbs)"
                variant="outlined"
                fullWidth
                required
                onChange={(event) => {
                  const value = event.target.value;
                  setInputs({ ...inputs, weight: value });
                }}
                error={weightError}
                helperText={weightError ? "Must be 3 digits" : ""}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                label="Height (ft)"
                variant="outlined"
                fullWidth
                required
                onChange={(event) => {
                  const value = event.target.value;
                  setInputs({ ...inputs, heightFt: value });
                }}
                error={heightFtError}
                helperText={heightFtError ? "Must be 1 digit" : ""}
              />
              <TextField
                size="small"
                label="Height (in)"
                variant="outlined"
                fullWidth
                required
                onChange={(event) => {
                  const value = event.target.value;
                  setInputs({ ...inputs, heightIn: value });
                }}
                error={heightInError}
                helperText={heightInError ? "Must be 1 or 2 digits." : ""}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                label="Body Fat (%)"
                variant="outlined"
                fullWidth
                required
                onChange={(event) => {
                  const value = event.target.value;
                  setInputs({ ...inputs, bodyFat: value });
                //   setBodyFatError(!value.match(/^\d{1,2}(\.\d{1,2})?$/));
                }}
                error={bodyFatError}
                helperText={bodyFatError ? "Must be 1 or 2 digits." : ""}
              />
              <TextField
                size="small"
                label="Target % Weight Loss"
                variant="outlined"
                fullWidth
                required
                onChange={(event) => {
                  const value = event.target.value;
                  setInputs({ ...inputs, targetWeight: value });
               }}
                error={targetWeightError}
                helperText={
                  targetWeightError ? "Must be 1 or 2 digits." : ""
                }
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                label="Neck (in)"
                variant="outlined"
                fullWidth
                required
                onChange={(event) => {
                  const value = event.target.value;
                  setInputs({ ...inputs, neck: value });
                }}
                error={neckError}
                helperText={neckError ? "Must be 1 or 2 digits." : ""}
              />
              <TextField
                size="small"
                label="Waist (in)"
                variant="outlined"
                fullWidth
                required
                onChange={(event) => {
                  const value = event.target.value;
                  setInputs({ ...inputs, waist: value });
                }}
                error={waistError}
                helperText={waistError ? "Must be 1 or 2 digits." : ""}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl variant="standard" required>
                <RadioGroup row value={inputs.sex}>
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                    onChange={handleRadioChange}
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                    onChange={handleRadioChange}
                  />
                </RadioGroup>
              </FormControl>
              <DatePicker
                label="Date"
                disableFuture
                value={value}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField fullWidth size="small" {...params} />
                )}
              />
            </Stack>
          </Stack>
          <Button
            component={Link}
            to={`/`}
            variant="contained"
           onClick={handleFormSubmission}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    );
  };

  const InfoDialog = (props) => {
    const handleClick = (button) => {
      button === "agree" ? setView(2) : setView(1);
    };
    return (
      <Box p={2}>
        <Stack spacing={2}>
          <Typography align="center">
            The research being used for this program has not yet been done to
            include anyone outside of this age range. You are more than welcome
            to still utilize the service, however, results may vary.
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => {
                handleClick("agree");
              }}
            >
              I Understand
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                handleClick("disagree");
              }}
            >
              Nevermind
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  };

  const SignInDialog = () => {
    const [inputs, setInputs] = useState({
      email: "",
      password: "",
    });
    const authUser = (inputs) => {
      signIn(inputs)
        .catch((err) => alert(err))
        .then((res) => setUser(res))
        .then(() => setUserSubmit(true));
    };

    return (
      <Box p={2}>
        <Stack justifyContent="center" spacing={2}>
          <Typography align="center" variant="h6">
            Sign In
          </Typography>
          <Stack spacing={2} justifyContent="center">
            <TextField
              size="small"
              label="Email Address"
              variant="outlined"
              onChange={(event) =>
                setInputs({ ...inputs, email: event.target.value })
              }
            />
            <TextField
              size="small"
              label="Password"
              variant="outlined"
              type="password"
              onChange={(event) =>
                setInputs({ ...inputs, password: event.target.value })
              }
            />
          </Stack>
          <Stack spacing={1}>
            <Button variant="contained" onClick={() => authUser(inputs)}>
              Sign In
            </Button>
            <Button size="small" onClick={() => setView(2)}>
              Don't have an account?
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  };

  const view = useDialogStore((state) => state.currentView);
  const setView = useDialogStore((state) => state.setCurrentView);
  const dialogDisplay = () => {
    switch (view) {
      case 1:
        return <EntryDialog />;
      case 2:
        return <SignUpDialog />;
      case 3:
        return <ConfirmDialog />;
      case 4:
        return <HealthDialog />;
      case 5:
        return <InfoDialog />;
      case 6:
        return <SignInDialog />;
      default:
        return <SignInDialog />;
    }
  };
  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="xs">
      {dialogDisplay()}
    </Dialog>
  );
};

export const AddStepsDialog = (props) => {
  const { username } = useUserStore((state) => state.currentUser);
  const today = moment().format("l");
  const [value, setValue] = useState(moment());
  const [inputs, setInputs] = useState({
    date: today,
    steps: 0,
  });
  const addStepCount = useStepCountStore((state) => state.addCount);
  const totalSteps = useStepCountStore((state) => state.totalSteps);
  const setTotalSteps = useStepCountStore((state) => state.setTotalSteps);
  const setCountsData = useStepCountStore((state) => state.setCountsData);
  const handleChange = (newValue) => {
    setValue(newValue);
    setInputs({ ...inputs, date: newValue.format("l") });
  };
  const handleClose = () => {
    props.handleClose(false);
  };
  const handleSubmit = () => {
    // console.log(steps);
    // const totalSteps = steps + inputs.steps;
    // console.log(steps);
    putSteps(username, inputs.date, inputs.steps)
      .then(() => getAllSteps(username))
      .then((res) => setCountsData(res))
      .then(() => setTotalSteps(Number(inputs.steps) + totalSteps))
      .then(() => addStepCount(inputs))
      .then(() => handleClose());
  };
  return (
    <Dialog open={props.open} fullWidth maxWidth="xs" onClose={handleClose}>
      <Box m={1} p={1}>
        <Typography align="center" variant="h6" mb={1}>
          Add Steps
        </Typography>
        <Stack spacing={1} alignItems="center">
          <Stack spacing={1} direction="row">
            <DatePicker
              label="Date"
              disableFuture
              value={value}
              onChange={handleChange}
              renderInput={(params) => (
                <TextField fullWidth size="small" {...params} />
              )}
            />
            <TextField
              size="small"
              label="Steps"
              variant="outlined"
              onChange={(event) =>
                setInputs({ ...inputs, steps: event.target.value })
              }
            />
          </Stack>
          <Stack spacing={1} direction="row">
            <Button variant="contained" onClick={() => handleSubmit()}>
              Submit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export const AddWeighInDialog = (props) => {
  const handleClose = () => {
    props.handleClose(false);
  };
  return (
    <Dialog open={props.open} fullWidth maxWidth="xs" onClose={handleClose}>
      <Box p={2}>
        <Stack justifyContent="center" spacing={2}>
          <Typography align="center" variant="h6">
            Sign In
          </Typography>
          <Stack spacing={2} justifyContent="center">
            <TextField size="small" label="Email Address" variant="outlined" />
            <TextField size="small" label="Password" variant="outlined" />
          </Stack>
          <Stack spacing={1}>
            <Button variant="contained">Sign In</Button>
            <Button size="small">Don't have an account?</Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};
