<?php

namespace Phpblaze\Bladelib\Rex;

use Illuminate\Foundation\Http\FormRequest;

class xSailRV extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $scSpat = [
            'admin.first_name' => 'required|max:255',
            'admin.last_name' => 'required', 'max:255',
            'admin.email' => 'required', 'email', 'max:255',
            'admin.password' => 'required', 'confirmed', 'min:8',
            'admin.password_confirmation' => 'required',
        ];

        $strVeR = [
            'license' => 'required', 'regex:/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i',
            'envato_username' => 'required'
        ];

        if (scSpatPkS()) {
            $strVeR = array_merge($strVeR, $scSpat);
        }

        return $strVeR;
    }

    public function attributes()
    {
        return [
            'admin.first_name' => 'first name',
            'admin.last_name' => 'last name',
            'admin.email' => 'email',
            'admin.password' => 'password',
            'admin.password_confirmation' => 'confirmation password',
            'license' => 'license',
            'envato_username' => 'envato username',
        ];
    }

    public function messages()
    {
        return [
            'license.regex' => 'Invalid purchase code',
        ];
    }
}
