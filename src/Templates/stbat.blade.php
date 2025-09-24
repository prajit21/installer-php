@extends('stv::stms')
@section('title', 'Database')
@section('content')
<div class="wizard-step-3 d-block">
  <form action="{{ route('install.database.config') }}" method="POST">
    @csrf
    @method('POST')
    <div class="row">
      @if (scDotPkS())
      <div class="database-field col-md">
        <h6>Please enter your database configuration details below.</h6>
        <div class="form-group form-row">
          <label>Host <span class="required-fill">*</span></label>
          <div>
            <input type="text" name="database[DB_HOST]"
              value="{{ old('database.DB_HOST') ? old('database.DB_HOST') : '127.0.0.1' }}"
              class="form-control" placeholder="127.0.0.1" autocomplete="off">
            @if ($errors->has('database.DB_HOST'))
            <span class="text-danger">{{ $errors->first('database.DB_HOST') }}</span>
            @endif
          </div>
        </div>
        <div class="form-group form-row">
          <label>Port<span class="required-fill">*</span></label>
          <div>
            <input type="number" name="database[DB_PORT]"
              value="{{ old('database.DB_PORT') ? old('database.DB_PORT') : '3306' }}"
              class="form-control" placeholder="3306" autocomplete="off">
            @if ($errors->has('database.DB_PORT'))
            <span class="text-danger">{{ $errors->first('database.DB_PORT') }}</span>
            @endif
          </div>
        </div>
        <div class="form-group form-row">
          <label>DB Username<span class="required-fill">*</span></label>
          <div>
            <input type="text" name="database[DB_USERNAME]" value="{{ old('database.DB_USERNAME') }}"
              class="form-control" autocomplete="off">
            @if ($errors->has('database.DB_USERNAME'))
            <span class="text-danger">{{ $errors->first('database.DB_USERNAME') }}</span>
            @endif
          </div>
        </div>
        <div class="form-group form-row">
          <label>DB Password</label>
          <div>
            <input type="password" name="database[DB_PASSWORD]" class="form-control" autocomplete="off">
            @if ($errors->has('database.DB_PASSWORD'))
            <span class="text-danger">{{ $errors->first('database.DB_PASSWORD') }}</span>
            @endif
          </div>
        </div>
        <div class="form-group form-row">
          <label>Database Name<span class="required-fill">*</span></label>
          <div>
            <input type="text" name="database[DB_DATABASE]" value="{{ old('database.DB_DATABASE') }}"
              class="form-control" autocomplete="off">
            @if ($errors->has('database.DB_DATABASE'))
            <span class="text-danger">{{ $errors->first('database.DB_DATABASE') }}</span>
            @endif
          </div>
        </div>
        <div class="form-group form-row form-check">
          <input class="form-check-input" name="is_import_data" type="checkbox" value="" id="importDummyData">
          <label class="form-check-label" for="is_import_data">
            Import Dummy Data
          </label>
        </div>
      </div>
      @endif
      @if(scSpatPkS())
      <div class="database-field col-md" id="adminFormGroup">
        <h6>Please enter your administration details below.</h6>
        <div class="form-group form-row">
          <label>First Name <span class="required-fill">*</span></label>
          <div>
            <input type="text" name="admin[first_name]" value="{{ old('admin.first_name') }}"
              class="form-control" autocomplete="off">
            @if ($errors->has('admin.first_name'))
            <span class="text-danger">{{ $errors->first('admin.first_name') }}</span>
            @endif
          </div>
        </div>
        <div class="form-group form-row">
          <label>Last Name<span class="required-fill">*</span></label>
          <div>
            <input type="text" name="admin[last_name]" value="{{ old('admin.last_name') }}"
              class="form-control" autocomplete="off">
            @if ($errors->has('admin.last_name'))
            <span class="text-danger">{{ $errors->first('admin.last_name') }}</span>
            @endif
          </div>
        </div>
        <div class="form-group form-row">
          <label>Email<span class="required-fill">*</span></label>
          <div>
            <input type="email" name="admin[email]" value="{{ old('admin.email') }}" class="form-control" autocomplete="off">
            @if ($errors->has('admin.email'))
            <span class="text-danger">{{ $errors->first('admin.email') }}</span>
            @endif
          </div>
        </div>
        <div class="form-group form-row">
          <label>Password<span class="required-fill">*</span></label>
          <div>
            <input type="password" name="admin[password]" class="form-control" autocomplete="off">
            @if ($errors->has('admin.password'))
            <span class="text-danger">{{ $errors->first('admin.password') }}</span>
            @endif
          </div>
        </div>
        <div class="form-group form-row">
          <label>Confirm Password <span class="required-fill">*</span></label>
          <div>
            <input type="password" name="admin[password_confirmation]" class="form-control" autocomplete="off">
            @if ($errors->has('admin.password_confirmation'))
            <span class="text-danger">{{ $errors->first('admin.password_confirmation') }}</span>
            @endif
          </div>
        </div>
      </div>
      @endif
    </div>
  </form>
  <div class="next-btn d-flex">
    <a href="{{ route('install.license') }}" class="btn btn-primary" id="previousBtn"><i class="far fa-hand-point-left me-2"></i>Previous</a>
    <a href="javascript:void(0)" id="submitBtn" class="btn btn-primary submit-form">Next<i class="far fa-hand-point-right ms-2"></i><span id="spinnerIcon" class="spinner-border spinner-border-sm ms-2 d-none"></span></a>
  </div>
</div>
@endsection
@section('scripts')
<script>
  $(document).ready(function() {
    'use strict';

    $('#importDummyData').change(function() {
      if ($(this).is(':checked')) {
        $('#adminFormGroup').addClass('d-none');
      } else {
        $('#adminFormGroup').removeClass('d-none');
      }
    });

    $('.submit-form').on('click', function(event) {
      event.preventDefault();
      $(this).addClass('disabled');
      $(this).find('i').addClass('d-none');
      $('#previousBtn').addClass('disabled');
      $('#submitBtn').addClass('disabled');
      $('#spinnerIcon').removeClass('d-none');
      $("form").submit();
    });
  });
</script>
@endsection
