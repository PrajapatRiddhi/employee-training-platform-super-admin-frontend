import React from "react";
import {FC, useCallback, useEffect, useState} from "react";
import {NextRouter, useRouter} from "next/router";
import {Button, Col, Input, Radio, Row, Select, Tooltip} from "antd";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "@/src/components/Notification";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import DownArrow from "@/src/components/Icons/DownArrow";
import LeftArrowBlueIcon from "@/src/components/Icons/LeftArrowBlueIcon";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import RightArrowWhiteIcon from "@/src/components/Icons/RightArrowWhiteIcon";
import RoleDescriptionIcon from "@/src/components/Icons/RoleDescriptionIcon";
import GeneralMenuIcon from "@/src/components/Icons/GeneralMenuIcon";
import ContentLibraryMenuIcon from "@/src/components/Icons/ContentLibraryMenuIcon";
import PhishingMenuIcon from "@/src/components/Icons/PhishingMenuIcon";
import TrainingMenuIcon from "@/src/components/Icons/TrainingMenuIcon";
import SuveyMenuIcon from "@/src/components/Icons/SuveyMenuIcon";
import ReportingMenuIcon from "@/src/components/Icons/ReportingMenuIcon";
import InfoIcon from "@/src/components/Icons/InfoIcon";
import NoAccessIcon from "@/src/components/Icons/NoAccessIcon";
import ReadAccessIcon from "@/src/components/Icons/ReadAccessIcon";
import ReadWriteAccessIcon from "@/src/components/Icons/ReadWriteAccessIcon";

type GroupList = {
  groupId: number;
  groupName: string;
};

const getRoleMenuIcon = (menuName: string, isActive: boolean) => {
  const blackColor = "#333333";
  const activeColor = "#4379EE";
  switch (menuName) {
    case "general":
      return <GeneralMenuIcon color={isActive ? activeColor : blackColor} />;
    case "content-library":
      return (
        <ContentLibraryMenuIcon color={isActive ? activeColor : blackColor} />
      );
    case "phishing":
      return <PhishingMenuIcon color={isActive ? activeColor : blackColor} />;
    case "training":
      return <TrainingMenuIcon color={isActive ? activeColor : blackColor} />;
    case "suvey":
      return <SuveyMenuIcon color={isActive ? activeColor : blackColor} />;
    case "reporting":
      return <ReportingMenuIcon color={isActive ? activeColor : blackColor} />;
  }
};

// const fragmentToMenu: any = {
//   training: { menu: "training", id: 1 }, // replace with the correct ID for 'training'
//   "create-role": { menu: "create-role", id: 2 }, // replace with the correct ID for 'create-role'
//   // Add more mappings as needed
// };

const Roles: FC = () => {
  const router: NextRouter = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [loading, setLoading] = useState<boolean>(false);

  const [initialFragmentSet, setInitialFragmentSet] = useState(false);

  const [isRoleCreated, setIsRoleCreated] = useState<boolean>(false);
  const [hidePreviousBtn, setHidePreviousBtn] = useState<boolean>(true);
  const [nextAndCreateRoleButtonText, setNextAndCreateRoleButtonText] =
    useState<string>("Next");
  const [groupList, setGroupList] = useState<GroupList[]>([]);

  const [roleName, setRoleName] = useState<string | number>("");
  const [groups, setGroups] = useState<number[]>([]);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [activeRoleMenu, setActiveRoleMenu] = useState<number>(0);
  const [activeRoleMenuId, setActiveRoleMenuId] = useState<number | null>(null);
  const [roleNameError, setRoleNameError] = useState<string | null>(null);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  const [capabilityDetails, setCapabilityDetails] = useState<any[]>([]);
  const [capabilityFormDetails, setCapabilityFormDetails] = useState<any>([]);
  const [formValues, setFormValues] = useState<any>({});

  const staticRoleMenu = () => (
    <div
      className={`border p-[10px] flex bg-[#F5F6FA] select-none ${
        isRoleCreated ? "cursor-not-allowed" : "cursor-pointer"
      } mb-[5px] flex items-center`}
    >
      <span className="pr-[10px] text-[#4379EE]">
        <RoleDescriptionIcon color={isRoleCreated ? "#BDBDBD" : "#4379EE"} />
      </span>
      <span
        className={`text-[14px] font-[600] ${
          isRoleCreated ? "text-[#BDBDBD]" : "text-[#4379EE]"
        }`}
      >
        New Roles & Rights
      </span>
    </div>
  );

  // disabled this fucntionality for now
  const addFragmentIdentifier = (id: string | number) => {
    // const urlWithoutHash = router.asPath.split("#")[0];
    // router.push(`${urlWithoutHash}#${id}`);
  };

  const handleRoleMenuClick = (
    orderNumber: number,
    roleMenuId: number,
    menuCode: string
  ) => {
    setActiveRoleMenu(orderNumber);
    setActiveRoleMenuId(roleMenuId);
    // addFragmentIdentifier(menuCode);

    if (orderNumber > 1) {
      setHidePreviousBtn(false);
      if (nextAndCreateRoleButtonText !== "Next") {
        setNextAndCreateRoleButtonText("Next");
      }
    }
    if (orderNumber === 1) {
      setHidePreviousBtn(true);
      setNextAndCreateRoleButtonText("Next");
    }
    if (orderNumber === capabilityDetails.length) {
      if (nextAndCreateRoleButtonText !== "Create Access Control") {
        setNextAndCreateRoleButtonText(
          router?.query?.id ? "Update Access Control" : "Create Access Control"
        );
      }
    }
  };

  const handleRolesAndRightsMenu = () => {
    const sortedCapabilities = capabilityDetails?.sort(
      (a: any, b: any) => a.orderNumber - b.orderNumber
    );

    return (
      <>
        {staticRoleMenu()}
        {sortedCapabilities?.map((capability: any) => (
          <div
            key={capability.roleMenuId}
            onClick={() =>
              handleRoleMenuClick(
                capability.orderNumber,
                capability.roleMenuId,
                capability.menuCode
              )
            }
            className={`border p-[10px] flex bg-[#F5F6FA] cursor-pointer mb-[5px] flex items-center select-none`}
          >
            <span className="pr-[10px] text-[#4379EE]">
              {getRoleMenuIcon(
                capability.menuCode,
                activeRoleMenu === capability.orderNumber
              )}
            </span>
            <span
              className={`text-[14px] font-[600] ${
                activeRoleMenu === capability.orderNumber
                  ? "text-[#4379EE]"
                  : "text-[#333333]"
              }`}
            >
              {capability.menuName}
            </span>
          </div>
        ))}
      </>
    );
  };

  const handleCreateRole = async () => {
    let isValid = true;
    const roleNameString =
      typeof roleName === "string" ? roleName.trim() : roleName.toString();
    if (!roleNameString) {
      setRoleNameError("Role Name is required.");
      isValid = false;
    } else {
      setRoleNameError(null);
    }
    if (!groups.length) {
      setGroupsError("At least one group must be selected.");
      isValid = false;
    } else {
      setGroupsError(null);
    }
    if (!isValid) return;
    setLoading(true);
    try {
      const payload: {roleName: string; groups?: number[]} = {
        roleName: roleNameString,
      };
      if (groups.length) {
        payload.groups = groups;
      }
      const result: any = await axiosInstance.post(
        `${API_ENDPOINTS.CREATE_ROLE}`,
        payload
      );

      if (Object.keys(result).length && result?.settings?.success) {
        setRoleId(result.data.roleId);
        setRoleName("");
        setGroups([]);
        setRoleNameError(null);
        setGroupsError(null);
      } else {
        handleNotifications("error", `${result?.settings?.message}`, "", 3);
      }
    } catch (e) {
      handleNotifications(
        "error",
        "Something went wrong. Please try again.",
        "",
        3
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextPrevButton = (btnType: string) => {
    if (isRoleCreated && capabilityDetails.length) {
      handleNextPrevBtnAndCategoryContent(btnType);
    } else {
      handleCreateRole();
    }
  };

  const handleButtons = () => (
    <div
      className={`flex ${hidePreviousBtn ? "justify-end" : "justify-between"}`}
    >
      {!hidePreviousBtn && (
        <Button
          className="text-[16px] text-[#4379EE] font-[700] py-[15px] px-[20px] flex items-center border border-[2px] border-[#4379EE]"
          type="default"
          size="large"
          loading={loading}
          onClick={() => handleNextPrevButton("prev")}
          disabled={loading || isRoleCreated ? false : roleName ? false : true}
        >
          <LeftArrowBlueIcon />
          <span className="ml-[10px]">Previous</span>
        </Button>
      )}
      <Button
        className="text-[16px] font-[700] py-[15px] px-[20px] flex items-center"
        type="primary"
        size="large"
        loading={loading}
        onClick={() => handleNextPrevButton(nextAndCreateRoleButtonText)}
        // disabled={loading || isRoleCreated ? false : roleName ? false : true}
      >
        <span className="mr-[10px]">{nextAndCreateRoleButtonText}</span>
        <RightArrowWhiteIcon />
      </Button>
    </div>
  );

  const handleChangeRoleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoleName(value);
    if (value.trim()) {
      setRoleNameError(null);
    }
  };

  const handleSelectGroups = (selectedGroups: number[]) => {
    setGroups(selectedGroups);
    if (selectedGroups !== undefined) {
      setGroupsError(null);
    }
  };

  const handleCreateStaticRoleUI = () => {
    return (
      <div id="create-role">
        <Row>
          <Col span={24}>
            <div className="mb-[5px] text-[16px] font-[400] text-[#000000]">
              Security Role Name<span className="text-red-500">*</span>
            </div>
            <Input
              value={roleName}
              onChange={handleChangeRoleName}
              style={{height: "40px"}}
              className="custom-input"
              placeholder="Please Type..."
              required
            />
            {roleNameError && (
              <div className="text-[#ff4d4f] text-[14px] mt-1">
                {roleNameError}
              </div>
            )}
          </Col>
        </Row>
        <Row className="my-[20px]">
          <Col span={24}>
            <div className="mb-[5px] text-[16px] font-[400] text-[#000000]">
              Groups<span className="text-red-500">*</span>
            </div>

            <Select
              size={"large"}
              showSearch={false}
              // maxCount={1}
              value={groups || []}
              mode="multiple"
              style={{height: "auto", width: "100%"}}
              className="custom-select"
              placeholder="Select Group"
              suffixIcon={<DownArrow />}
              onChange={handleSelectGroups}
            >
              {groupList?.length &&
                groupList.map((group: GroupList) => (
                  <Select.Option value={group.groupId} key={group.groupId}>
                    {group.groupName}
                  </Select.Option>
                ))}
            </Select>
            {groupsError && (
              <div className="text-[#ff4d4f] text-[14px] mt-1">
                {groupsError}
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  };

  const handleRadioChange = (capabilityCategoryId: number, value: string) => {
    const index = capabilityFormDetails.findIndex(
      (item: any) => item.capabilityCategoryId === capabilityCategoryId
    );
    if (index !== -1) {
      const newCapabilityFormDetails = [...capabilityFormDetails];
      newCapabilityFormDetails[index].categoryCapability = value;
      setCapabilityFormDetails(newCapabilityFormDetails);
    }
  };

  const getAccessIcon = (
    permissionName: string,
    capabilityCategoryId: number
  ) => {
    const isSelected =
      capabilityFormDetails.find(
        (capability: any) =>
          capability.capabilityCategoryId === capabilityCategoryId
      )?.categoryCapability === permissionName;
    const color = isSelected ? "#FFFFFF" : "#828282";

    switch (permissionName) {
      case "no-access":
        return <NoAccessIcon color={color} />;
      case "read":
      case "show":
        return <ReadAccessIcon color={color} />;
      case "read/write":
        return <ReadWriteAccessIcon color={color} />;
    }
  };

  const getRadioOptions = (Options: any, capabilityCategoryId: number) =>
    Options.map((capability: any) => (
      <Radio.Button
        key={capabilityCategoryId}
        value={capability.permissionValue}
        className={`text-[16px] font-[700]`}
      >
        <div className="flex justify-center items-center gap-[10px]">
          <span>
            {getAccessIcon(capability.permissionValue, capabilityCategoryId)}
          </span>
          <span>{capability.permissionName}</span>
        </div>
      </Radio.Button>
    ));

  const handleSelectChange = (
    capabilityCategoryId: number,
    value: any,
    type: string
  ) => {
    const index = capabilityFormDetails.findIndex(
      (item: any) => item.capabilityCategoryId === capabilityCategoryId
    );

    if (index !== -1) {
      const newCapabilityFormDetails = [...capabilityFormDetails];
      newCapabilityFormDetails[index][type] = value;
      setCapabilityFormDetails(newCapabilityFormDetails);
    }
  };

  const getSelectField = (
    capabilityCategoryId: number,
    title: string,
    placeholder: string,
    item: any,
    idAlias: string,
    nameAlias: string,
    defaultValue: any,
    type: string
  ) => {
    return (
      <div className="mt-[10px]">
        <div className="mb-[5px] text-[16px] font-[400] text-[#000000]">
          {title}
        </div>

        <Select
          defaultValue={defaultValue ? defaultValue : []}
          mode="tags"
          size={"large"}
          showSearch={false}
          style={{height: "40px", width: "100%"}}
          className="custom-select"
          placeholder={placeholder}
          suffixIcon={<DownArrow />}
          onChange={(value) => {
            console.log("temp value changess", value);
            handleSelectChange(capabilityCategoryId, value, type);
          }}
        >
          {item?.map((item: any) => (
            <Select.Option value={item[idAlias]}>
              {item[nameAlias]}
            </Select.Option>
          ))}
        </Select>
      </div>
    );
  };

  const handleGroupOrDept = (category: any) => {
    return (
      <>
        <div className="mt-[10px]">
          {getSelectField(
            category.capabilityCategoryId,
            "Targeted Groups",
            "Select Group/User",
            category?.capabilityGroupsDepartments?.length &&
              category?.capabilityGroupsDepartments[0]?.groups,
            "groupId",
            "groupName",
            category?.capabilityGroupsDepartments[0]?.groupIds,
            "groupId"
          )}
        </div>
        <div className="mt-[10px]">
          {getSelectField(
            category.capabilityCategoryId,
            "Targeted Departments",
            "Select Departments",
            category?.capabilityGroupsDepartments?.length &&
              category?.capabilityGroupsDepartments[0]?.departments,
            "departmentId",
            "departmentName",
            category?.capabilityGroupsDepartments[0]?.departmentIds,
            "departmentId"
          )}
        </div>
      </>
    );
  };

  const handleCapabilityFormDetails = useCallback((capabilityDetails: any) => {
    if (capabilityDetails.length) {
      const capabilityFormDetails = capabilityDetails.flatMap(
        (capability: any) =>
          capability.roleCategories.map((category: any) => {
            const categoryDetails: any = {
              capabilityCategoryId: category.capabilityCategoryId,
              categoryCapability: category.categoryCapability,
            };

            if (category.isThereAnyGroupOrDept) {
              categoryDetails.groupIds =
                category.capabilityGroupsDepartments.flatMap(
                  (group: any) => group.groupIds
                );
              categoryDetails.departmentIds =
                category.capabilityGroupsDepartments.flatMap(
                  (dept: any) => dept.departmentIds
                );
            }

            return categoryDetails;
          })
      );

      setCapabilityFormDetails(capabilityFormDetails);
    }
  }, []);

  const getDefaultValue = (
    capabilityCategoryId: number,
    categoryCapability: string
  ) => {
    const category =
      capabilityFormDetails?.length &&
      capabilityFormDetails?.find(
        (category: any) =>
          category.capabilityCategoryId === capabilityCategoryId
      );
    if (category) {
      return category.categoryCapability;
    }
    return categoryCapability;
  };

  console.log("temp categories", capabilityDetails);

  const handleCreateCategoryDynemicUI = useCallback(() => {
    if (activeRoleMenuId && capabilityDetails.length) {
      const capability = capabilityDetails.find(
        (capability: any) => capability.roleMenuId === activeRoleMenuId
      );
      if (capability && capability.roleCategories?.length) {
        return (
          <div>
            {capability.roleCategories.map((category: any) => {
              return (
                <Row gutter={[10, 30]} className="mb-[20px]">
                  <Col
                    xs={24}
                    md={8}
                    className="flex justify-end items-center h-[40px]"
                  >
                    <div className="text-[16px] font-[400] text-[#000000] flex justify-center items-center whitespace-normal text-end">
                      {category?.categoryName.length > 30 ? (
                        <Tooltip title={category?.categoryName}>
                          <div className="mr-[10px] cursor-pointer">
                            {category?.categoryName}
                          </div>
                        </Tooltip>
                      ) : (
                        <div className="mr-[10px]">
                          {category?.categoryName}
                        </div>
                      )}
                      <div className="cursor-pointer">
                        <Tooltip title={category?.categoryName}>
                          <span>
                            <InfoIcon />
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={16}>
                    <div>
                      <Radio.Group
                        key={capability.roleMenuId}
                        id={capability.roleMenuId}
                        name={capability.roleMenuId}
                        className="custom-radio-button"
                        defaultValue={() =>
                          getDefaultValue(
                            category.capabilityCategoryId,
                            category.categoryCapability
                          )
                        }
                        buttonStyle="solid"
                        onChange={(e) =>
                          handleRadioChange(
                            category.capabilityCategoryId,
                            e.target.value
                          )
                        }
                      >
                        {getRadioOptions(
                          category.possibleCapability,
                          category.capabilityCategoryId
                        )}
                      </Radio.Group>
                    </div>
                    {category?.isThereAnyGroupOrDept &&
                      handleGroupOrDept(category)}
                  </Col>
                </Row>
              );
            })}
          </div>
        );
      }
    }
  }, [activeRoleMenuId, capabilityDetails]);

  const handleCategories = () => {
    if (isRoleCreated && capabilityDetails.length) {
      return handleCreateCategoryDynemicUI();
    } else {
      return handleCreateStaticRoleUI();
    }
  };

  const getGroupList = async () => {
    setLoading(true);
    try {
      const result: any = await axiosInstance.get(
        `${API_ENDPOINTS.DROPDOWN_LIST_GROUP}?isRoleAndRights=true`
      );
      if (Object.keys(result).length && result?.settings?.success) {
        setGroupList(result.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const getRoleCapability = async () => {
    setLoading(true);
    try {
      const result: any = await axiosInstance.get(
        `${API_ENDPOINTS.ROLE_CAPABILITY}/${roleId}`
      );
      if (Object.keys(result).length && result?.settings?.success) {
        setCapabilityDetails(result.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  const handleNextPrevBtnAndCategoryContent = (btnType: string) => {
    if (btnType === "Next") {
      if (activeRoleMenu >= 1 && activeRoleMenu < capabilityDetails.length) {
        if (hidePreviousBtn) {
          setHidePreviousBtn(false);
        }

        if (nextAndCreateRoleButtonText !== "Next") {
          setNextAndCreateRoleButtonText("Next");
        }

        setActiveRoleMenu((prevVal) => {
          if (prevVal + 1 === capabilityDetails.length) {
            setNextAndCreateRoleButtonText(
              router?.query?.id
                ? "Update Access Control"
                : "Create Access Control"
            );
          }
          return prevVal + 1;
        });
      } else {
        setHidePreviousBtn(true);
      }
    } else if (btnType === "prev") {
      if (activeRoleMenu >= 1) {
        if (activeRoleMenu === capabilityDetails.length) {
          setNextAndCreateRoleButtonText("Next");
        }
        setActiveRoleMenu((prevVal) => {
          if (prevVal - 1 === 1) {
            setHidePreviousBtn(true);
            return 1;
          }
          return prevVal - 1;
        });
      } else {
        setHidePreviousBtn(true);
      }
    } else if (
      btnType === "Create Access Control" ||
      btnType === "Update Access Control"
    ) {
      onFinish();
    }
  };

  const onFinish = async () => {
    if (Object.keys(capabilityFormDetails).length) {
      const payload = {
        roleId,
        capabilityDetails: capabilityFormDetails,
      };
      setLoading(true);
      try {
        const result: any = await axiosInstance.put(
          `${API_ENDPOINTS.ROLE_CAPABILITY}`,
          payload
        );
        if (Object.keys(result).length && result?.settings?.success) {
          // handleNotifications(`success`, `${result?.settings?.message}`, ``, 3);
          handleNotifications(
            `success`,
            `${
              router?.query?.id
                ? "Company role updated successfully"
                : "Company role created successfully"
            }`,
            ``,
            3
          );
          router.replace("/users/manage-roles-and-rights");
        } else {
          handleNotifications(`error`, `${result?.settings?.message}`, ``, 3);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
  };

  // useEffect(() => {
  //   const handleRouteChange = (url: string) => {
  //     // Get the fragment identifier from the URL
  //     const fragment = url.split("#")[1];

  //     // Get the corresponding menu and ID
  //     const menuAndId = fragmentToMenu[fragment];

  //     if (menuAndId) {
  //       setActiveRoleMenu(menuAndId.menu);
  //       setActiveRoleMenuId(menuAndId.id);
  //     }
  //   };

  //   router.events.on("routeChangeComplete", handleRouteChange);

  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [router]);

  useEffect(() => {
    if (activeRoleMenu >= 1) {
      const capability = capabilityDetails.find(
        (capability: any) => capability.orderNumber === activeRoleMenu
      );
      setActiveRoleMenuId(capability.roleMenuId);
    }
  }, [activeRoleMenu]);

  useEffect(() => {
    if (capabilityDetails.length) {
      const capability = capabilityDetails.find(
        (capability: any) => capability.orderNumber === 1
      );
      setActiveRoleMenu(1);
      setIsRoleCreated(true);
      setActiveRoleMenuId(capability.roleMenuId);
      handleCapabilityFormDetails(capabilityDetails);
    }

    const capability = capabilityDetails.find(
      (capability: any) => capability.orderNumber === 1
    );
    if (capability) {
      addFragmentIdentifier(capability.menuCode);
    }
  }, [capabilityDetails]);

  useEffect(() => {
    roleId && getRoleCapability();
  }, [roleId]);

  useEffect(() => {
    getGroupList();
  }, []);

  useEffect(() => {
    if (!initialFragmentSet && !router.asPath.includes("#create-role")) {
      addFragmentIdentifier("create-role");
      setInitialFragmentSet(true);
    }
  }, [router.asPath, initialFragmentSet]);

  useEffect(() => {
    if (router?.query?.id) {
      setRoleId(Number(router?.query?.id));
    }
  }, [router?.query?.id]);

  return (
    <SidebarLayout>
      <div>
        <div className="flex items-center text-[24px] font-[700] text-[#313D4F] mb-[30px]">
          <span className="cursor-pointer" onClick={() => router.back()}>
            <LeftArrowIcon />
          </span>
          <span className="pl-[15px]">
            {router?.query?.id ? "Update " : "New "}Roles & Rights
          </span>
        </div>

        <Row gutter={[31, 31]}>
          <Col xs={24} lg={6} className="">
            <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] p-[20px]">
              {handleRolesAndRightsMenu()}
            </div>
          </Col>
          <Col xs={24} lg={18} className="min-h-[60vh]">
            <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] p-[30px] min-h-[70vh] flex flex-col justify-between">
              {handleCategories()}
              {handleButtons()}
            </div>
          </Col>
        </Row>
      </div>
    </SidebarLayout>
  );
};

export default React.memo(Roles);
