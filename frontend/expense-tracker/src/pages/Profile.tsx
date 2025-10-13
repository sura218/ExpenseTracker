import {
  Calendar,
  DollarSign,
  Download,
  Palette,
  Save,
  Settings,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { useQuery } from "@tanstack/react-query";
import { getTransactions, TransactionForm } from "../utils/transaction";

const Profile = () => {
  const [userSettings, setUserSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "1234",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    theme: "system",
    notifications: true,
    emailReports: false,
    budgetAlerts: true,
  });
  const [tempSettings, setTempSettings] = useState(userSettings);
  const [isEditing, setIsEditing] = useState(false);
  function handleSaveSettings() {
    setUserSettings(tempSettings);
    setIsEditing(false);
  }
  const {
    data: transaction = [],
    isLoading: transactionLoading,
  } = useQuery<TransactionForm[]>({
    queryKey: ["transaction"],
    queryFn: getTransactions,
  });

  if(transactionLoading) return <p>Loading...</p>

  const totalTransctions = transaction.length;
  const totalIncome = transaction
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = transaction
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl text-foreground font-bold font-roboto">
          Profile & Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and app preferences
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 shadow-sm">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                <User className="w-5 h-5" />
                Profie Information
              </CardTitle>
              <CardDescription>
                update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-muted-foreground">
                      {userSettings.name}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      {userSettings.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
              {isEditing && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        id="name"
                        value={tempSettings.name}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={tempSettings.email}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        id="Password"
                        type="password"
                        value={tempSettings.password}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveSettings}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <Settings className="w-4 h-4" />
                App Preferences
              </CardTitle>
              <CardDescription className="">
                Customize how the app works for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Currency
                  </Label>
                  <Select
                    value={tempSettings.currency}
                    onValueChange={(value) =>
                      setTempSettings({ ...tempSettings, currency: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Format
                  </Label>
                  <Select
                    value={tempSettings.dateFormat}
                    onValueChange={(Value) =>
                      setTempSettings({ ...tempSettings, dateFormat: Value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Theme
                  </Label>
                  <Select
                    value={tempSettings.theme}
                    onValueChange={(value) =>
                      setTempSettings({ ...tempSettings, theme: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground font-bold">
                Account Overview
              </CardTitle>
              <CardDescription>Your expense tracking summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className=" text-muted-foreground font-medium text-sm">
                  Total Transactions
                </span>
                <span>{totalTransctions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </span>
                <span className="text-sm font-medium text-chart-2">
                  ${totalIncome.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </span>
                <span className="text-sm font-medium text-chart-3">
                  ${totalExpenses.toFixed(2)}
                </span>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Net Balance
                </span>
                <span
                  className={`text-sm font-bold ${
                    totalIncome - totalExpenses >= 0
                      ? "text-chart-2"
                      : "text-chart-3"
                  }`}
                >
                  ${(totalIncome - totalExpenses).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground font-roboto">
                <Shield className="w-4 h-4" />
                Data Management
              </CardTitle>
              <CardDescription>Export or clear your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Download className="w-4 h-4" />
                Export Data
              </Button>
              <hr />
              <Button
                variant="destructive"
                className="w-full flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
